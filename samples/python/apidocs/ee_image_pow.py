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

# [START earthengine__apidocs__ee_image_pow]
# A Sentinel-2 surface reflectance image.
img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG')

# Subset two image bands and display them on the map.
swir_1 = img.select('B11')
swir_2 = img.select('B12')
m = geemap.Map()
m.set_center(-122.276, 37.456, 12)
m.add_ee_layer(swir_1, {'min': 0, 'max': 3000}, 'swir_1')
m.add_ee_layer(swir_2, {'min': 0, 'max': 3000}, 'swir_2')

# The following examples demonstrate ee.Image arithmetic methods using two
# single-band ee.Image inputs.
addition = swir_1.add(swir_2)
m.add_ee_layer(addition, {'min': 100, 'max': 6000}, 'addition')

subtraction = swir_1.subtract(swir_2)
m.add_ee_layer(subtraction, {'min': 0, 'max': 1500}, 'subtraction')

multiplication = swir_1.multiply(swir_2)
m.add_ee_layer(multiplication, {'min': 1.9e5, 'max': 9.4e6}, 'multiplication')

division = swir_1.divide(swir_2)
m.add_ee_layer(division, {'min': 0, 'max': 3}, 'division')

remainder = swir_1.mod(swir_2)
m.add_ee_layer(remainder, {'min': 0, 'max': 1500}, 'remainder')

# If a number input is provided as the second argument, it will automatically
# be promoted to an ee.Image object, a convenient shorthand for constants.
exponent = swir_1.pow(3)
m.add_ee_layer(exponent, {'min': 0, 'max': 2e10}, 'exponent')
m
# [END earthengine__apidocs__ee_image_pow]
