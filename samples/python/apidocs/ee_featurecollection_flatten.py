# Copyright 2023 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START earthengine__apidocs__ee_featurecollection_flatten]
# Counties in New Mexico, USA.
counties = ee.FeatureCollection('TIGER/2018/Counties').filter('STATEFP == "35"')

# Monthly climate and climatic water balance surfaces for January 2020.
climate = ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE').filterDate(
    '2020-01', '2020-02')

# Calculate mean climate variables for each county per climate surface
# time step. The result is a FeatureCollection of FeatureCollections.
def reduce_mean(image):
  return image.reduceRegions(**{
      'collection': counties,
      'reducer': ee.Reducer.mean(),
      'scale': 5000,
      'crs': 'EPSG:4326'
      })
counties_climate = climate.map(reduce_mean)

# Note that a printed FeatureCollection of FeatureCollections is not
# recursively expanded, you cannot view metadata of the features within the
# nested collections until you isolate a single collection or flatten the
# collections.
print('FeatureCollection of FeatureCollections:', counties_climate.getInfo())

print('Flattened FeatureCollection of FeatureCollections:',
      counties_climate.flatten().getInfo())
# [END earthengine__apidocs__ee_featurecollection_flatten]
