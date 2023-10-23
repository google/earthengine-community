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

# [START earthengine__apidocs__ee_image_unmask]
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

# Apply the single-band land mask to all image bands pixel values equal to 0
# in the mask become invalid in the image.
img_masked = img.updateMask(land_mask)
display('Image, land only', img_masked)
m.add_layer(img_masked, true_color_viz, 'Image, land only')

# Set invalid masked pixels to a new value, e.g. a constant nodata value
# when exporting an image as GeoTIFF.
img_unmasked = img_masked.unmask(32767)
display('Image, unmasked', img_masked)
m.add_layer(img_unmasked, true_color_viz, 'Image, unmasked')

# Reset masked pixels to valid, fill with default value 0, input footprint.
mask_reset_footprint = img_masked.unmask()
display('Image mask reset, footprint', mask_reset_footprint)
m.add_layer(mask_reset_footprint, true_color_viz, 'Image mask reset, footprint')

# Reset masked pixels to valid, fill with default value 0, everywhere.
mask_reset_everywhere = img_masked.unmask(sameFootprint=False)
display('Image mask reset, everywhere', mask_reset_everywhere)
m.add_layer(
    mask_reset_everywhere, true_color_viz, 'Image mask reset, everywhere'
)

# Fill masked pixels with pixels from a different image.
fill = ee.Image('COPERNICUS/S2_SR/20200618T184919_20200618T190341_T10SEG')
img_filled = img_masked.unmask(fill)
display('Image, filled', img_filled)
m.add_layer(img_filled, true_color_viz, 'Image, filled')
m
# [END earthengine__apidocs__ee_image_unmask]
