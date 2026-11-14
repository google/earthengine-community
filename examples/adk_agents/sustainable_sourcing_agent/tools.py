"""Sustainable sourcing agent tools."""

import asyncio
import json
import logging
from typing import Any, List

import ee
from google.api_core import retry
from google.protobuf.json_format import MessageToDict
import numpy as np
from vertexai import rag

from . import datasets


@retry.AsyncRetry(deadline=60)
async def retrieve_rag_documentation(query: str) -> str:
  """Retrieves information about EUDR, WHISP, compliance and due diligence.
  
  NOTE: Edit the rag_corpus variable to use your Cloud Project and your RAG ID.
  
  Args:
    query: The search query.

  Returns:
    A string containing the retrieved information.
  """
  response = await asyncio.to_thread(
      rag.retrieval_query,
      rag_resources=[
          rag.RagResource(
              rag_corpus='projects/your-cloud-project/locations/us-central1/ragCorpora/your-rag-id',
          )
      ],
      text=query,
      rag_retrieval_config=rag.RagRetrievalConfig(
          top_k=5,
          filter=rag.utils.resources.Filter(vector_distance_threshold=0.4),
      ),
  )
  return json.dumps(MessageToDict(response._pb))


_WHISP_IMAGES = None
_WHISP_IMAGES_LOCK = asyncio.Lock()
_CROP_NAMES = ['forest', 'cocoa', 'coffee', 'palm', 'rubber']


def _get_commodity_by_year_and_version(
    commodity: str, year: int, version: str
) -> ee.Image:
  """Retrieves a commodity probability image for a specific year and version.

  See https://github.com/google/forest-data-partnership/tree/main/models.

  Args:
    commodity: The name of the commodity (e.g., 'cocoa', 'palm').
    year: The year of the data to retrieve.
    version: The model version string (e.g., '2025b').

  Returns:
    An ee.Image containing the commodity probability for the specified year
    and version.
  """
  collection_path = (
      f'projects/forestdatapartnership/assets/{commodity}/model_{version}'
  )
  collection = ee.ImageCollection(collection_path)
  date_filter = ee.Filter.calendarRange(year, year, 'year')
  band_name = f'{commodity}_probability_{year}'
  return collection.filter(date_filter).mosaic().rename(band_name)


def _get_nf_image() -> ee.Image:
  """Returns the Natural Forest 2020 image.

  See "Natural forests of the world - a 2020 baseline for deforestation and
  degradation monitoring.  https://www.nature.com/articles/s41597-025-06097-z"
  """
  return (
      ee.ImageCollection(
          'projects/nature-trace/assets/forest_typology/natural_forest_2020_v1_0_collection'
      )
      .mosaic()
      .divide(250)
      .selfMask()
      .rename('natural_forest_2020')
  )


def get_areas_image() -> ee.Image:
  """Generates an Earth Engine Image with thresholded crop and forest areas.

  This function combines Natural Forest and commodity (cocoa, coffee, palm,
  rubber) probability layers, thresholds them, and calculates areas of
  "unclassified" and "confusion" pixels. The output bands represent the
  pixel area in square meters for each class.

  Returns:
    An ee.Image containing bands for each crop/forest type (thresholded),
    'unclassified' areas (no class above threshold), and 'confusion' areas
    (multiple classes above threshold), all in square meters.
  """
  # THRESHOLDS FOR DEMONSTRATION ONLY! Tune these to your needs.
  thresholds = [
      0.37,  # forest
      0.48,  # cocoa
      0.28,  # coffee
      0.90,  # palm
      0.38,  # rubber
  ]

  # A mini-ensemble of GDM and Forest Data Partnership products.
  ensemble = ee.Image.cat(
      _get_nf_image().rename('forest'),
      _get_commodity_by_year_and_version('cocoa', 2020, '2025b').rename(
          'cocoa'
      ),
      _get_commodity_by_year_and_version('coffee', 2020, '2025b').rename(
          'coffee'
      ),
      _get_commodity_by_year_and_version('palm', 2020, '2025b').rename('palm'),
      _get_commodity_by_year_and_version('rubber', 2020, '2025b').rename(
          'rubber'
      ),
  )

  # Threshold the probabilities.  THRESHOLDS FOR DEMONSTRATION ONLY!
  thresholded = ensemble.select(_CROP_NAMES).gt(ee.Image(thresholds))

  # Unclassified means no predicted presence at the specified thresholds.
  unclassified = thresholded.reduce('sum').eq(0)

  # Confusion means two or more classes predicted presence.
  confusion = thresholded.reduce('sum').gt(1).selfMask()

  return ee.Image.cat(
      thresholded,
      unclassified.rename('unclassified'),
      confusion.rename('confusion'),
  ).multiply(ee.Image.pixelArea())


def get_suso_layers_2025b() -> ee.Image:
  """Returns a stacked Earth Engine Image of key SUSO layers for 2025b.

  This includes Natural Forest 2020 and commodity probability layers
  (cocoa, coffee, palm, rubber) for both 2020 and 2024, using the '2025b'
  model version.
  """
  return ee.Image.cat(
      _get_nf_image(),
      _get_commodity_by_year_and_version('cocoa', 2020, '2025b'),
      _get_commodity_by_year_and_version('cocoa', 2024, '2025b'),
      _get_commodity_by_year_and_version('coffee', 2020, '2025b'),
      _get_commodity_by_year_and_version('coffee', 2024, '2025b'),
      _get_commodity_by_year_and_version('palm', 2020, '2025b'),
      _get_commodity_by_year_and_version('palm', 2024, '2025b'),
      _get_commodity_by_year_and_version('rubber', 2020, '2025b'),
      _get_commodity_by_year_and_version('rubber', 2024, '2025b'),
  )


@retry.AsyncRetry(deadline=60)
async def get_suso_stats(geojson: dict[str, str | float]) -> dict[str, float]:
  """Calculates sustainable sourcing (SUSO) related statistics for a geojson.

  This function computes the total area, the area covered by different crop
  types and forest, and a Gini index within the provided geojson region.

  Args:
    geojson: A dictionary representing a GeoJSON geometry.

  Returns:
    A dictionary containing the calculated statistics, including:
      - Sum of pixel areas for each class in `get_areas_image()`.
      - 'gini': A Gini index based on the proportions of crop areas.
      - 'total_area': The total area of the region in square meters.
  """
  region = ee.Geometry(geojson)
  feature_area = ee.Number(region.area(10))
  suso_image = get_areas_image()
  # Sum of pixel areas in square meters.
  stats = suso_image.reduceRegion(
      reducer=ee.Reducer.sum(), geometry=region, scale=10, maxPixels=1e10
  )
  # Gini index.
  # See https://en.wikipedia.org/wiki/Decision_tree_learning#Gini_impurity.
  proportions_squared = ee.List(
      [ee.Number(stats.get(c)).divide(feature_area).pow(2) for c in _CROP_NAMES]
  )
  gini = ee.Number(1).subtract(proportions_squared.reduce(ee.Reducer.sum()))
  # Update the EE dictionary.
  stats = stats.set('gini', gini).set('total_area', feature_area)
  # Request the result to the client and return it.
  return await asyncio.to_thread(stats.getInfo)


def easy_whisp() -> List[ee.Image]:
  """Retrieves a list of Earth Engine Images from functions in the datasets module.

  Each function in `datasets.list_functions()` is called, and the resulting
  ee.Image is added to a list. Exceptions during image retrieval are logged.

  Returns:
    A list of ee.Image objects.
  """
  images_list = []
  for func in datasets.list_functions():
    try:
      image = func()
      images_list.append(image)
    except ee.EEException as e:
      logging.error(str(e))
  return images_list


@retry.AsyncRetry(deadline=60)
async def get_stats(region: ee.Geometry, image: ee.Image) -> dict[str, float]:
  """Calculates mean values of an image within a given region.

  Args:
    region: The region of interest (ee.Geometry).
    image: The ee.Image to calculate stats for.

  Returns:
    A dictionary containing the mean values of image bands within the region.
  """
  stats = image.reduceRegion(
      reducer=ee.Reducer.mean(), geometry=region, scale=10, maxPixels=1e10
  )
  return await asyncio.to_thread(stats.getInfo)


@retry.AsyncRetry(deadline=60)
async def get_whisp_stats(geojson: dict[str, str | float]) -> dict[str, float]:
  """Calculates WHISP stats for a given geojson.

  Args:
    geojson: The geojson defining the region of interest.

  Returns:
    A dictionary containing the mean values of the WHISP images within the
    region.

  Raises:
      RuntimeError: If no WHISP stats could be retrieved due to API errors.
  """
  global _WHISP_IMAGES
  async with _WHISP_IMAGES_LOCK:
    if _WHISP_IMAGES is None:
      _WHISP_IMAGES = await asyncio.to_thread(easy_whisp)
  region = ee.Geometry(geojson)
  whisp_stats = {}
  successful_requests = 0

  tasks = [get_stats(region, img) for img in _WHISP_IMAGES]
  results = await asyncio.gather(*tasks, return_exceptions=True)

  for i, result in enumerate(results):
    if isinstance(result, Exception):
      logging.error('%s generated an exception: %s', _WHISP_IMAGES[i], result)
    else:
      whisp_stats.update(result)
      successful_requests += 1

  if successful_requests == 0:
    raise RuntimeError(
        'Failed to retrieve any WHISP stats from Earth Engine due to API'
        ' errors.'
    )

  return whisp_stats


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
  threshold = np.pi / 4  # Arbitrary change threshold.
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
  region = ee.Geometry(json.loads(geojson))
  return await asyncio.to_thread(
      get_annual_change_dictionary_2018_2025(region).getInfo
  )

