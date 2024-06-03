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
#   from 'Reducers - Overview' section.

# [START earthengine__reducers00_overview__ic_extrema]
# Load and filter the Sentinel-2 image collection.
collection = (
    ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterDate('2016-01-01', '2016-12-31')
    .filterBounds(ee.Geometry.Point([-81.31, 29.90]))
)

# Reduce the collection.
extrema = collection.reduce(ee.Reducer.minMax())
# [END earthengine__reducers00_overview__ic_extrema]

# TEST:
display(collection)
m = geemap.Map()
m.set_center(-81.31, 29.90, 13)
m.add_layer(collection.median(), {'bands': ['B4', 'B3', 'B2'], 'max': 4000})
display(m)

# [START earthengine__reducers00_overview__combine]
# Load a Landsat 8 image.
image = ee.Image('LANDSAT/LC08/C02/T1/LC08_044034_20140318')

# Combine the mean and standard deviation reducers.
reducers = ee.Reducer.mean().combine(
    reducer2=ee.Reducer.stdDev(), sharedInputs=True
)

# Use the combined reducer to get the mean and SD of the image.
stats = image.reduceRegion(reducer=reducers, bestEffort=True)

# Display the dictionary of band means and SDs.
display(stats)
# [END earthengine__reducers00_overview__combine]
