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

"""Earth Engine Developer's Guide examples from 'Landsat Algorithms - Radiance and Reflectance' section."""

# [START earthengine__landsat01__radiance_toa]
# Load a raw Landsat scene and display it.
raw = ee.Image('LANDSAT/LC08/C02/T1/LC08_044034_20140318')
m = geemap.Map()
m.center_object(raw, 10)
m.add_layer(
    raw, {'bands': ['B4', 'B3', 'B2'], 'min': 6000, 'max': 12000}, 'raw'
)

# Convert the raw data to radiance.
radiance = ee.Algorithms.Landsat.calibratedRadiance(raw)
m.add_layer(radiance, {'bands': ['B4', 'B3', 'B2'], 'max': 90}, 'radiance')

# Convert the raw data to top-of-atmosphere reflectance.
toa = ee.Algorithms.Landsat.TOA(raw)

m.add_layer(toa, {'bands': ['B4', 'B3', 'B2'], 'max': 0.2}, 'toa reflectance')
m
# [END earthengine__landsat01__radiance_toa]

# [START earthengine__landsat01__sr_image]
sr_image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20201028')
# [END earthengine__landsat01__sr_image]

# [START earthengine__landsat01__sr_collections]
surface_reflectance_l4 = ee.ImageCollection('LANDSAT/LT04/C02/T1_L2')
surface_reflectance_l5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
surface_reflectance_l7 = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2')
surface_reflectance_l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
surface_reflectance_l9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
# [END earthengine__landsat01__sr_collections]


# Checks (not seen by user):
display(sr_image)
display(surface_reflectance_l4.first())
display(surface_reflectance_l5.first())
display(surface_reflectance_l7.first())
