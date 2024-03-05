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

"""Earth Engine Developer's Guide examples from 'Landsat Algorithms - Cloud Score' section."""

# [START earthengine__landsat02__cloud_score]
# Load a cloudy Landsat scene and display it.
cloudy_scene = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140926')
m = geemap.Map()
m.center_object(cloudy_scene)
m.add_layer(
    cloudy_scene, {'bands': ['B4', 'B3', 'B2'], 'max': 0.4}, 'TOA', False
)

# Add a cloud score band.  It is automatically called 'cloud'.
scored = ee.Algorithms.Landsat.simpleCloudScore(cloudy_scene)

# Create a mask from the cloud score and combine it with the image mask.
mask = scored.select(['cloud']).lte(20)

# Apply the mask to the image and display the result.
masked = cloudy_scene.updateMask(mask)
m.add_layer(masked, {'bands': ['B4', 'B3', 'B2'], 'max': 0.4}, 'masked')
m
# [END earthengine__landsat02__cloud_score]

# [START earthengine__landsat02__sensor_id]
# Load a Landsat 8 TOA collection, make 15-day mosaic, set SENSOR_ID property.
mosaic = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterDate('2019-06-01', '2019-06-16')
    .mosaic()
    .set('SENSOR_ID', 'OLI_TIRS')
)

# Cloud score the mosaic and display the result.
scored_mosaic = ee.Algorithms.Landsat.simpleCloudScore(mosaic)
m = geemap.Map()
m.add_layer(
    scored_mosaic,
    {'bands': ['B4', 'B3', 'B2'], 'max': 0.4},
    'TOA mosaic',
)
m
# [END earthengine__landsat02__sensor_id]
