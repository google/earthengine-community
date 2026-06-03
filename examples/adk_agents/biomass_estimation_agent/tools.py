"""Forest, biomass/carbon accounting tools."""

import asyncio
import json
from typing import Any

import ee
from google.api_core import exceptions as google_exceptions
from google.api_core import retry
import numpy as np


def get_esa_biomass_image() -> ee.Image:
  """Gets the ESA CCI Above Ground Biomass (AGB) image.

  Loads the ESA CCI AGB dataset and returns an Earth Engine Image
  containing the 'AGB' band.

  Returns:
    An ee.Image representing the ESA CCI Above Ground Biomass.
  """
  agb = ee.ImageCollection("projects/sat-io/open-datasets/ESA/ESA_CCI_AGB")
  return agb.select("AGB").toBands()


def get_weighted_mean_in_polygon(
    polygon: ee.Geometry, image: ee.Image, weights: ee.Image, scale: float
) -> ee.Dictionary:
  """Calculates the weighted mean of an image within a given polygon.

  Args:
    polygon: The ee.Geometry in which to compute the stats.
    image: The ee.Image object to analyze.
    weights: The ee.Image object to use as weights.
    scale: The scale at which to perform the analysis.

  Returns:
    An ee.FeatureCollection containing the weighted mean of the image bands.
  """
  return image.updateMask(weights).reduceRegion(
      geometry=polygon, reducer=ee.Reducer.mean(), scale=scale, maxPixels=1e13
  )


def get_esa_biomass_stats_in_geometry(geometry: ee.Geometry) -> ee.Dictionary:
  """Gets the mean ESA AGB stock within a given Earth Engine geometry.

  Args:
    geometry: The ee.Geometry in which to compute the stats.

  Returns:
    An ee.Dictionary containing the mean AGB stock.
  """
  return get_weighted_mean_in_polygon(
      polygon=geometry,
      image=get_esa_biomass_image(),
      weights=ee.Image(1),
      scale=10,
  )


@retry.AsyncRetry(deadline=60)
async def get_esa_biomass_stats(geojson: str) -> dict[str, Any]:
  """Gets the mean ESA AGB stock within a given GeoJSON geometry.

  Args:
    geojson (str): A JSON string representing a GeoJSON geometry.

  Returns:
    A dictionary containing the mean AGB stock.
  """
  try:
    region = ee.Geometry(json.loads(geojson))
    return await asyncio.to_thread(
        get_esa_biomass_stats_in_geometry(region).getInfo
    )
  except google_exceptions.GoogleAPICallError:
    raise
  except Exception as e:  # pylint: disable=broad-except
    return {"error": f"Error in get_esa_biomass_stats: {e}"}


def get_esa_biomass_trend_in_geometry(geometry: ee.Geometry) -> ee.Dictionary:
  """Gets the trend of ESA AGB stock within a given Earth Engine geometry.

  This function calculates the linear trend (slope) of Above Ground Biomass
  (AGB) over time within the specified geometry using the ESA CCI AGB dataset.

  Args:
    geometry: The ee.Geometry in which to compute the trend.

  Returns:
    An ee.Dictionary containing the mean slope of the AGB stock trend
    within the geometry.
  """

  def create_time_band(img):
    year = img.date().get("year")
    return ee.Image(year).float().addBands(img)

  collection = (
      ee.ImageCollection("projects/sat-io/open-datasets/ESA/ESA_CCI_AGB")
      .select("AGB")
      .map(create_time_band)
  )
  fit = collection.reduce(ee.Reducer.linearFit())
  slope = fit.select(["scale"], ["slope"])
  return get_weighted_mean_in_polygon(
      polygon=geometry,
      image=slope,
      weights=ee.Image(1),
      scale=10,
  )


@retry.AsyncRetry(deadline=60)
async def get_esa_biomass_trend_stats(
    geojson: str,
) -> dict[str, Any]:
  """Gets the trend of ESA AGB stock within a given GeoJSON geometry.

  Args:
    geojson (str): A JSON string representing a GeoJSON geometry.

  Returns:
    A dictionary containing the mean slope of the AGB stock trend.
  """
  try:
    region = ee.Geometry(json.loads(geojson))
    return await asyncio.to_thread(
        get_esa_biomass_trend_in_geometry(region).getInfo
    )
  except google_exceptions.GoogleAPICallError:
    raise
  except Exception as e:  # pylint: disable=broad-except
    return {"error": f"Error in get_esa_biomass_trend_stats: {e}"}


def _quality_mask_gedi(image: ee.Image) -> ee.Image:
  """Masks out low-quality GEDI observations.

  This function updates the mask of a GEDI image to exclude pixels where
  'l4_quality_flag' is not equal to 1 or 'degrade_flag' is not equal to 0,
  as these indicate lower quality data.

  Args:
    image: An ee.Image expected to contain 'l4_quality_flag' and 'degrade_flag'
      bands.

  Returns:
    The input ee.Image with an updated mask.
  """
  return image.updateMask(image.select("l4_quality_flag").eq(1)).updateMask(
      image.select("degrade_flag").eq(0)
  )


def _error_mask_gedi(image: ee.Image) -> ee.Image:
  """Masks out GEDI observations with high relative standard error.

  This function updates the mask of a GEDI image to exclude pixels where
  the relative standard error of 'agbd' (agbd_se / agbd) is greater than 0.5.

  Args:
    image: An ee.Image expected to contain 'agbd_se' and 'agbd' bands.

  Returns:
    The input ee.Image with an updated mask.
  """
  relative_se = image.select("agbd_se").divide(image.select("agbd"))
  return image.updateMask(relative_se.lte(0.5))


def get_estimated_biomass_image(geometry: ee.Geometry, year: int) -> ee.Image:
  """Estimates above-ground biomass for a given year within a specified geometry.

  This function trains a Random Forest classifier using Google's Satellite
  Embeddings as inputs and GEDI L4A biomass estimates as the target. The
  trained model is then used to predict biomass across the specified geometry.
  This only works for years after 2019 and up to about 52 degrees latitude.

  Args:
    geometry: The ee.Geometry within which to estimate biomass.
    year: The year for which to generate the biomass estimate.

  Returns:
    An ee.Image containing the estimated above-ground biomass.
  """
  embeddings = ee.ImageCollection("GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL")
  gedi = ee.ImageCollection("LARSE/GEDI/GEDI04_A_002_MONTHLY")
  # Filter by year
  filt = ee.Filter.calendarRange(year, year, "year")
  # Prepare inputs (Embeddings)
  inputs = embeddings.filter(filt).mosaic()
  # Prepare target (GEDI Biomass)
  biomass = (
      gedi.filter(filt)
      .map(_quality_mask_gedi)
      .map(_error_mask_gedi)
      .select("agbd")
      .mosaic()
  )
  # Create training sample
  sample = inputs.addBands(biomass).sample(
      region=geometry, scale=10, geometries=True
  )
  # Train Random Forest
  rf = (
      ee.Classifier.smileRandomForest(10)
      .setOutputMode("REGRESSION")
      .train(
          features=sample,
          classProperty="agbd",
          inputProperties=inputs.bandNames(),
      )
  )
  # Classify and clip
  return inputs.classify(rf).clip(geometry)


def get_estimated_biomass_stats_in_geometry(
    geometry: ee.Geometry, year: int
) -> ee.Dictionary:
  """Gets the estimated AGB stock within a given Earth Engine geometry.

  Args:
    geometry: The ee.Geometry in which to compute the stats.
    year: The year in which to compute the stats.

  Returns:
    An ee.Dictionary containing the mean AGB stock.
  """
  return get_weighted_mean_in_polygon(
      polygon=geometry,
      image=get_estimated_biomass_image(geometry, year),
      weights=ee.Image(1),
      scale=10,
  )


@retry.AsyncRetry(deadline=60)
async def get_estimated_biomass_stats(
    geojson: str, year: int = 2024
) -> dict[str, Any]:
  """Gets the estimated AGB stock within a given GeoJSON geometry.

  This method is based on a regression of GEDI AGB on AEF embeddings.
  This only works for years after 2019 and up to about 52 degrees latitude.

  Args:
    geojson (str): A JSON string representing a GeoJSON geometry.
    year (int, optional): The year for which to estimate biomass. Defaults to
      2024.

  Returns:
    A dictionary containing the mean carbon stock.
  """
  try:
    region = ee.Geometry(json.loads(geojson))
    return await asyncio.to_thread(
        get_estimated_biomass_stats_in_geometry(region, year).getInfo
    )
  except google_exceptions.GoogleAPICallError:
    raise
  except Exception as e:  # pylint: disable=broad-except
    return {"error": f"Error in get_estimated_biomass_stats: {e}"}


def get_2020_natural_forest_area_dictionary(
    geometry: ee.Geometry, threshold: float, scale: float
) -> ee.Dictionary:
  """Calculates the area of natural forest within a given geometry for the year 2020.

  Args:
    geometry: The Earth Engine geometry to calculate the forest area within.
    threshold: A probability threshold used to binarize the natural forest
      image.  Higher values will result in a more conservative estimate of
      natural forest area.
    scale: The scale in meters at which to perform the reduction.

  Returns:
    An Earth Engine dictionary containing the sum of natural forest pixel areas
    within the specified geometry.
  """
  nf = ee.ImageCollection(
      "projects/nature-trace/assets/forest_typology/natural_forest_2020_v1_0_collection"
  )
  natural_forest = (
      nf.mosaic().divide(250).gt(threshold).multiply(ee.Image.pixelArea())
  )
  return natural_forest.reduceRegion(
      reducer=ee.Reducer.sum(), geometry=geometry, scale=scale, maxPixels=1e13
  )


def get_2020_natural_forest_area_sq_meters(
    geometry: ee.Geometry,
) -> ee.Dictionary:
  """Gets the natural forest area in square meters for a given geometry in 2020.

  Uses a default threshold of 0.9 and a scale of 10 meters.

  Args:
    geometry: The Earth Engine geometry to calculate the forest area within.

  Returns:
    A dictionary storing the area result.
  """
  threshold = 0.9  # Arbitrary.
  scale = 10
  return get_2020_natural_forest_area_dictionary(geometry, threshold, scale)


@retry.AsyncRetry(deadline=60)
async def get_2020_natural_forest_area_stats(
    geojson: str,
) -> dict[str, Any]:
  """Gets the natural forest area in square meters for a given GeoJSON in 2020.

  Args:
    geojson (str): A JSON string representing a GeoJSON geometry.

  Returns:
    A dictionary containing the natural forest area in square meters.
  """
  try:
    region = ee.Geometry(json.loads(geojson))
    return await asyncio.to_thread(
        get_2020_natural_forest_area_sq_meters(region).getInfo
    )
  except google_exceptions.GoogleAPICallError:
    raise
  except Exception as e:  # pylint: disable=broad-except
    return {"error": f"Error in get_2020_natural_forest_area_stats: {e}"}


def get_angle(image1: ee.Image, image2: ee.Image) -> ee.Image:
  """Calculates the angle between two Earth Engine images.

  This function treats each pixel as a vector and computes the angle between
  the vectors from `image1` and `image2` using the dot product formula:
  angle = acos((image1 * image2) / (|image1| * |image2|)).
  Assuming the images are already normalized or the magnitude is handled
  elsewhere, this implementation simplifies to acos(dot_product).

  Args:
    image1: The first ee.Image.
    image2: The second ee.Image.

  Returns:
    An ee.Image containing the angle in radians.
  """
  return image1.multiply(image2).reduce(ee.Reducer.sum()).acos().rename("angle")


def get_change_year_image(threshold: float):
  """Generates an image showing the year of significant change.

  This function uses the GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL dataset to detect
  significant changes between consecutive years from 2018 to 2025. It calculates
  the angle between the embeddings of each year and the previous year. Pixels
  where this angle exceeds pi/4 are considered to have undergone a significant
  change. The output is a multi-band image where each band corresponds to a
  year, and the pixel value is the year if a significant change was detected
  in that year compared to the previous one.

  Args:
    threshold: Angular threshold in radians above which change is assumed.

  Returns:
    An ee.Image with bands for each year from 2018 to 2025, indicating
    the year of change.
  """
  embeddings = ee.ImageCollection("GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL")
  years = ee.List.sequence(2018, 2025)

  def annual_changes(year: int) -> ee.Image:
    cur = embeddings.filter(
        ee.Filter.calendarRange(year, year, "year")
    ).mosaic()
    prev_year = ee.Number(year).subtract(1)
    prev = embeddings.filter(
        ee.Filter.calendarRange(prev_year, prev_year, "year")
    ).mosaic()
    return (
        get_angle(prev, cur)
        .gt(threshold)
        .multiply(ee.Image.constant(year))
        .selfMask()
        .rename(ee.Number(year).format("%d"))
    )

  changes = (
      ee.ImageCollection.fromImages(years.map(annual_changes))
      .toBands()
      .rename(years.map(lambda s: ee.Number(s).format("%d")))
  )
  return changes


def get_annual_change_dictionary_2018_2025(
    geometry: ee.Geometry,
) -> ee.Dictionary:
  """Gets a dictionary of annual change areas within a given geometry.

  This function calculates the total area (in square meters) for each year
  (from 2018 to 2025) where significant land cover change was detected within
  the specified Earth Engine geometry.

  Args:
    geometry: The ee.Geometry in which to compute the change areas.

  Returns:
    An ee.Dictionary where keys are years (as strings) and values are the
    total area in square meters for which change was detected in that year.
  """
  threshold = np.pi / 4
  scale = 10
  change_year_image = get_change_year_image(threshold)
  change_year_areas = change_year_image.gt(0).multiply(ee.Image.pixelArea())
  return change_year_areas.reduceRegion(
      reducer=ee.Reducer.sum(), geometry=geometry, scale=scale, maxPixels=1e13
  )


@retry.AsyncRetry(deadline=60)
async def get_annual_change_stats_2018_2025(
    geojson: str,
) -> dict[str, Any]:
  """Gets a dictionary of annual change areas within a given GeoJSON geometry.

  This function calculates the total area (in square meters) for each year
  (from 2018 to 2025) where significant land cover change was detected within
  the specified GeoJSON geometry.

  Args:
    geojson (str): A JSON string representing a GeoJSON geometry.

  Returns:
    A dictionary where keys are years (as strings) and values are the
    total area in square meters for which change was detected in that year.
  """
  try:
    region = ee.Geometry(json.loads(geojson))
    return await asyncio.to_thread(
        get_annual_change_dictionary_2018_2025(region).getInfo
    )
  except google_exceptions.GoogleAPICallError:
    raise
  except Exception as e:  # pylint: disable=broad-except
    return {"error": f"Error in get_annual_change_stats_2018_2025: {e}"}


def get_2020_forest_persistence_area_dictionary(
    geometry: ee.Geometry, threshold: float, scale: float
) -> ee.Dictionary:
  """Calculates the area of persistent forest in 2020 within a given geometry.

  Args:
    geometry: The Earth Engine geometry to calculate the forest area within.
    threshold: A threshold used to binarize the forest persistence image. Pixels
      with values greater than this threshold are considered persistent forest.
    scale: The scale in meters at which to perform the reduction.

  Returns:
    An Earth Engine dictionary containing the sum of persistent forest pixel
    areas within the specified geometry.
  """
  forest_persistence = (
      ee.Image(
          "projects/forestdatapartnership/assets/community_forests/ForestPersistence_2020"
      )
      .gt(threshold)
      .multiply(ee.Image.pixelArea())
  )
  return forest_persistence.reduceRegion(
      reducer=ee.Reducer.sum(), geometry=geometry, scale=scale, maxPixels=1e13
  )


@retry.AsyncRetry(deadline=60)
async def get_forest_persistence_2020_stats(
    geojson: str,
) -> dict[str, Any]:
  """Gets the area of persistent forest in 2020 within a given GeoJSON geometry.

  Args:
    geojson (str): A JSON string representing a GeoJSON geometry.

  Returns:
    A dictionary containing the area of persistent forest in square meters.
  """
  try:
    region = ee.Geometry(json.loads(geojson))
    threshold = 0.95
    scale = 10
    return await asyncio.to_thread(
        get_2020_forest_persistence_area_dictionary(
            region, threshold, scale
        ).getInfo
    )
  except google_exceptions.GoogleAPICallError:
    raise
  except Exception as e:  # pylint: disable=broad-except
    return {"error": f"Error in get_forest_persistence_2020_stats: {e}"}


@retry.AsyncRetry(deadline=60)
async def get_geometry_area(
    geojson: str,
) -> dict[str, Any]:
  """Calculates the area of a given GeoJSON geometry.

  Args:
    geojson (str): A JSON string representing a GeoJSON geometry.

  Returns:
    A dictionary containing the area of the geometry in square meters.
  """
  try:
    return await asyncio.to_thread(
        ee.Geometry(json.loads(geojson)).area(10).getInfo
    )
  except google_exceptions.GoogleAPICallError:
    raise
  except Exception as e:  # pylint: disable=broad-except
    return {"error": f"Error in get_geometry_area: {e}"}


def get_annual_dynamic_world_land_cover(year: int) -> ee.Image:
  """Gets an annual land cover classification image from Dynamic World.

  This function processes the GOOGLE/DYNAMICWORLD/V1 dataset to create a
  single land cover image for a specified year. It takes the mean of all
  Dynamic World images within that year and then selects the land cover
  class with the highest mean probability for each pixel.

  Args:
    year: The year for which to generate the annual land cover image.

  Returns:
    An ee.Image with a single band named "label", where pixel values
    represent the dominant Dynamic World land cover class for that year.
  """
  dw = ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1")
  annual_dw = dw.filter(ee.Filter.calendarRange(year, year, "year")).mean()
  return (
      annual_dw.select(annual_dw.bandNames().remove("label"))
      .toArray()
      .arrayArgmax()
      .arrayGet(0)
      .rename("label")
      .int()
  )


def get_transition_matrix(im1: ee.Image, im2: ee.Image) -> ee.Image:
  """Calculates a transition matrix between two land cover classification images.

  This function takes two Earth Engine images, each expected to have a "label"
  band representing land cover classes. It computes a transition matrix where
  each element (i, j) represents the number of pixels that transitioned from
  class i in `im1` to class j in `im2`. The classes are assumed to be integers
  from 0 to 8, corresponding to Dynamic World labels.

  Args:
    im1: The first ee.Image with a "label" band.
    im2: The second ee.Image with a "label" band.

  Returns:
    An ee.Image representing the transition matrix. Each band corresponds to
    a row of the matrix, and pixel values within each band represent the
    transition counts to each column class.
  """
  labels = ee.Image(ee.Array([0, 1, 2, 3, 4, 5, 6, 7, 8])).int()
  # Create one-hot encoded arrays (N x 1)
  one_hot1 = ee.Image(im1).select("label").eq(labels).toArray(1)
  # Create one-hot encoded arrays (1 x N) via transpose
  one_hot2 = (
      ee.Image(im2).select("label").eq(labels).toArray(1).matrixTranspose()
  )
  # Matrix multiply (N x 1) * (1 x N) = (N x N) image
  return one_hot1.matrixMultiply(one_hot2)


def get_annual_landcover_transitions_image(year1: int, year2: int) -> ee.Image:
  """Generates an image representing land cover transitions between two years.

  This function uses the Dynamic World dataset to create annual land cover
  classifications for `year1` and `year2`. It then computes a transition
  matrix image where each pixel's bands represent the transition counts
  from each class in `year1` to each class in `year2`.

  Args:
    year1: The starting year for the transition analysis.
    year2: The ending year for the transition analysis.

  Returns:
    An ee.Image representing the transition matrix between the land cover
    classifications of `year1` and `year2`.
  """
  lab1 = get_annual_dynamic_world_land_cover(year1)
  lab2 = get_annual_dynamic_world_land_cover(year2)

  return get_transition_matrix(lab1, lab2)


def get_transition_dict(geom, transition_image) -> ee.Dictionary:
  """Reduces a transition matrix image over a given geometry.

  This function sums the values of each band in the `transition_image`
  within the specified `geom`. The `transition_image` is expected to be
  the result of `get_transition_matrix`, where each band represents
  a row of the transition matrix.

  Args:
    geom: The ee.Geometry over which to reduce the image.
    transition_image: An ee.Image representing a transition matrix, typically
      from `get_transition_matrix`.

  Returns:
    An ee.Dictionary containing the summed values for each band
    of the transition image within the geometry.
  """
  return transition_image.reduceRegion(
      reducer=ee.Reducer.sum().forEachElement(),
      geometry=geom,
      scale=10,
      maxPixels=1e13,
      tileScale=4,
  )


@retry.AsyncRetry(deadline=60)
async def get_dynamic_world_landcover_transitions(
    geojson: str,
    year1: int = 2020,
    year2: int = 2024,
) -> dict[str, Any]:
  """Gets land cover transition probabilities between two years for a GeoJSON.

  This function uses the Dynamic World dataset to analyze land cover changes
  between `year1` and `year2` within the specified GeoJSON `geojson`. The
  years can be between 2014 and 2026. It returns a transition matrix where
  each row represents a land cover class in `year1`, and each column
  represents a land cover class in `year2`. The values are the probabilities
  of transitioning from the row class to the column class.

  Args:
    geojson (str): A JSON string representing a GeoJSON geometry.
    year1 (int, optional): The starting year for the transition analysis.
      Defaults to 2020.
    year2 (int, optional): The ending year for the transition analysis. Defaults
      to 2024.

  Returns:
    A nested dictionary where the outer keys are the land cover labels
    for `year1`, and the inner dictionaries contain the probabilities of
    transitioning to each land cover label in `year2`.
  """
  try:
    transitions_image = get_annual_landcover_transitions_image(year1, year2)
    geometry = ee.Geometry(json.loads(geojson))
    transitions_dict = get_transition_dict(geometry, transitions_image)

    # Fetch data to client.
    # The result is a dict with one key containing the 9x9 matrix.
    data = await asyncio.to_thread(transitions_dict.getInfo)

    # Extract the raw matrix (list of lists) from the first key.
    matrix_key = list(data.keys())[0]
    raw_matrix = data[matrix_key]

    # Build the dictionary
    result_struct = {}
    labels = [
        "💧 Water",
        "🌳 Trees",
        "🌾 Grass",
        "🌿 Wetlnd",
        "🚜 Crops",
        "🪴 Shrubs",
        "🏗️ Built_",
        "🪨 Bare_",
        "❄️ Snow ",
    ]
    for i, row_label in enumerate(labels):
      row_values = raw_matrix[i]
      row_total = sum(row_values)
      # Create the inner dictionary for this row
      row_dict = {}
      for j, col_label in enumerate(labels):
        # Calculate probability (Stochastic Matrix logic)
        # Avoid division by zero if a class doesn't exist in the region
        if row_total > 0:
          val = row_values[j] / row_total
        else:
          val = 0.0

        row_dict[col_label] = val

      result_struct[row_label] = row_dict

    return result_struct
  except google_exceptions.GoogleAPICallError:
    raise
  except Exception as e:  # pylint: disable=broad-except
    return {"error": f"Error in get_dynamic_world_landcover_transitions: {e}"}
