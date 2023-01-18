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

# [START earthengine__apidocs__ee_data_computefeatures]
from pprint import pprint

# Region of interest.
pt = ee.Geometry.Point([-122.0679107870136, 36.983302098145906])
# Imagery of interest.
images = (ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
          .filterBounds(pt).filterDate('2021-01-01', '2021-12-31'))

def point_overlay(image):
  """Extracts image band values for pixel-point intersection."""
  return ee.Feature(pt, image.reduceRegion('first', pt, 30))

# Convert an ImageCollection to a FeatureCollection.
features = images.map(point_overlay)

features_dict = ee.data.computeFeatures({'expression': features})

pprint(features_dict)
# Do something with the features...
# [END earthengine__apidocs__ee_data_computefeatures]