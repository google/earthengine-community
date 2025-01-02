# Copyright 2024 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Earth Engine Developer's Guide examples from 'Reducers - splitWeights' section."""

# [START earthengine__reducers12__split_weights]
# Load an input Landsat 8 image.
image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_186059_20130419')

# Compute cloud score and reverse it such that the highest
# weight (100) is for the least cloudy pixels.
cloud_weight = ee.Image(100).subtract(
    ee.Algorithms.Landsat.simpleCloudScore(image).select(['cloud'])
)

# Compute NDVI and add the cloud weight band.
ndvi = image.normalizedDifference(['B5', 'B4']).addBands(cloud_weight)

# Define an arbitrary region in a cloudy area.
region = ee.Geometry.Rectangle(9.9069, 0.5981, 10.5, 0.9757)

# Use a mean reducer.
reducer = ee.Reducer.mean()

# Compute the unweighted mean.
unweighted = ndvi.select(['nd']).reduceRegion(reducer, region, 30)

# compute mean weighted by cloudiness.
weighted = ndvi.reduceRegion(reducer.splitWeights(), region, 30)

# Observe the difference as a result of weighting by cloudiness.
display('unweighted:', unweighted)
display('weighted:', weighted)
# [END earthengine__reducers12__split_weights]
