# Copyright 2024 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


#  Earth Engine Developer's Guide examples
#   from 'Feature Collections' page.

# [START earthengine__features04__fc_information]
# Load watersheds from a data table.
sheds = (
    ee.FeatureCollection('USGS/WBD/2017/HUC06')
    # Filter to the continental US.
    .filterBounds(ee.Geometry.Rectangle(-127.18, 19.39, -62.75, 51.29))
    # Convert 'areasqkm' property from string to number.
    .map(
        lambda feature: feature.set(
            'areasqkm', ee.Number.parse(feature.get('areasqkm'))
        )
    )
)

# Display the table and print its first element.
m = geemap.Map()
m.add_layer(sheds, {}, 'watersheds')
display(m)
display('First watershed:', sheds.first())

# Print the number of watersheds.
display('Count:', sheds.size())

# Print stats for an area property.
display('Area stats:', sheds.aggregate_stats('areasqkm'))
# [END earthengine__features04__fc_information]


# [START earthengine__features04__fc_column_info]
# Import a protected areas point feature collection.
wdpa = ee.FeatureCollection('WCMC/WDPA/current/points')

# Fetch collection metadata (`.limit(0)`). The printed object is a
# dictionary where keys are column names and values are datatypes.
wdpa.limit(0).getInfo()['columns']
# [END earthengine__features04__fc_column_info]


# [START earthengine__features04__fc_filtering]
# Load watersheds from a data table.
sheds = (
    ee.FeatureCollection('USGS/WBD/2017/HUC06')
    # Convert 'areasqkm' property from string to number.
    .map(
        lambda feature: feature.set(
            'areasqkm', ee.Number.parse(feature.get('areasqkm'))
        )
    )
)

# Define a region roughly covering the continental US.
continental_us = ee.Geometry.Rectangle(-127.18, 19.39, -62.75, 51.29)

# Filter the table geographically: only watersheds in the continental US.
filtered = sheds.filterBounds(continental_us)

# Check the number of watersheds after filtering for location.
display('Count after filter:', filtered.size())

# Filter to get only larger continental US watersheds.
large_sheds = filtered.filter(ee.Filter.gt('areasqkm', 25000))

# Check the number of watersheds after filtering for size and location.
display('Count after filtering by size:', large_sheds.size())
# [END earthengine__features04__fc_filtering]
m = geemap.Map()
m.set_center(-96.25, 40, 4)
m.add_layer(large_sheds, {}, 'large watersheds')
display(m)

# [START earthengine__features04__add_property]
# Load watersheds from a data table.
sheds = ee.FeatureCollection('USGS/WBD/2017/HUC06')

# Map an area calculation function over the FeatureCollection.
area_added = sheds.map(
    lambda feature: feature.set(
        {'areaHa': feature.geometry().area().divide(100 * 100)}
    )
)

# Print the first feature from the collection with the added property.
display('First feature:', area_added.first())
# [END earthengine__features04__add_property]

# [START earthengine__features04__centroids]
# This function creates a new feature from the centroid of the geometry.
def get_centroid(feature):
  # Keep this list of properties.
  keep_properties = ['name', 'huc6', 'tnmid', 'areasqkm']
  # Get the centroid of the feature's geometry.
  centroid = feature.geometry().centroid()
  # Return a new Feature, copying properties from the old Feature.
  return ee.Feature(centroid).copyProperties(feature, keep_properties)

# Map the centroid getting function over the features.
centroids = sheds.map(get_centroid)

# Display the results.
m = geemap.Map()
m.set_center(-96.25, 40, 4)
m.add_layer(centroids, {'color': 'FF0000'}, 'centroids')
m
# [END earthengine__features04__centroids]

# [START earthengine__features04__reduce_column]
# Load watersheds from a data table and filter to the continental US.
sheds = ee.FeatureCollection('USGS/WBD/2017/HUC06').filterBounds(
    ee.Geometry.Rectangle(-127.18, 19.39, -62.75, 51.29)
)

# This function computes the squared difference between an area property
# and area computed directly from the feature's geometry.
def area_diff(feature):
  # Compute area in sq. km directly from the geometry.
  area = feature.geometry().area().divide(1000 * 1000)
  # Compute the difference between computed area and the area property.
  diff = area.subtract(ee.Number.parse(feature.get('areasqkm')))
  # Return the feature with the squared difference set to the 'diff' property.
  return feature.set('diff', diff.pow(2))

# Calculate RMSE for population of difference pairs.
rmse = (
    ee.Number(
        # Map the difference function over the collection.
        sheds.map(area_diff)
        # Reduce to get the mean squared difference.
        .reduceColumns(ee.Reducer.mean(), ['diff']).get('mean')
    )
    # Compute the square root of the mean square to get RMSE.
    .sqrt()
)

# Print the result.
display('RMSE=', rmse)
# [END earthengine__features04__reduce_column]

# [START earthengine__features04__reduce_regions]
# Load an image of daily precipitation in mm/day.
precip = ee.Image(ee.ImageCollection('NASA/ORNL/DAYMET_V3').first())

# Load watersheds from a data table and filter to the continental US.
sheds = ee.FeatureCollection('USGS/WBD/2017/HUC06').filterBounds(
    ee.Geometry.Rectangle(-127.18, 19.39, -62.75, 51.29)
)

# Add the mean of each image as new properties of each feature.
with_precip = precip.reduceRegions(sheds, ee.Reducer.mean()).filter(
    ee.Filter.notNull(['prcp'])
)


# This function computes total rainfall in cubic meters.
def prcp_volume(feature):
  # Precipitation in mm/day -> meters -> sq. meters.
  volume = (
      ee.Number(feature.get('prcp'))
      .divide(1000)
      .multiply(feature.geometry().area())
  )
  return feature.set('volume', volume)

high_volume = (
    # Map the function over the collection.
    with_precip.map(prcp_volume)
    # Sort descending and get only the 5 highest volume watersheds.
    .sort('volume', False).limit(5)
    # Extract the names to a list.
    .reduceColumns(ee.Reducer.toList(), ['name']).get('list')
)

# Print the resulting FeatureCollection.
display(high_volume)

# [END earthengine__features04__reduce_regions]
