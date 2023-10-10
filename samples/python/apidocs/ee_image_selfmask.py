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

# [START earthengine__apidocs__ee_image_selfmask]
# A Sentinel-2 surface reflectance image.
img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG')
true_color_viz = {
    'bands': ['B4', 'B3', 'B2'],
    'min': 0,
    'max': 2700,
    'gamma': 1.3,
}
display('Sentinel-2 image', img)
m = geemap.Map()
m.set_center(-122.36, 37.47, 10)
m.add_layer(img, true_color_viz, 'Sentinel-2 image')

# Create a Boolean land mask from the SWIR1 band water is value 0, land is 1.
land_mask = img.select('B11').gt(100)
display('Land mask', land_mask)
m.add_layer(land_mask, {'palette': ['blue', 'lightgreen']}, 'Land mask')

# Mask the land mask by itself pixel values equal to 0 (water) become invalid.
land_mask_masked = land_mask.selfMask()
display('Land mask, masked', land_mask_masked)
m.add_layer(land_mask_masked, {'palette': ['gold']}, 'Land mask, masked')
m
# [END earthengine__apidocs__ee_image_selfmask]
