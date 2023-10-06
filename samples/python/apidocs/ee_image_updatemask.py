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

# [START earthengine__apidocs__ee_image_updatemask]
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
m.add_ee_layer(img, true_color_viz, 'Sentinel-2 image')

# Create a Boolean land mask from the SWIR1 band water is value 0, land is 1.
land_mask = img.select('B11').gt(100)
display('Land mask', land_mask)
m.add_ee_layer(land_mask, {'palette': ['blue', 'lightgreen']}, 'Land mask')

# Apply the single-band land mask to all image bands pixel values equal to 0
# in the mask become invalid in the image.
img_masked = img.updateMask(land_mask)
display('Image, land only', img_masked)
m.add_ee_layer(img_masked, true_color_viz, 'Image, land only')

# Masks are band-specific. Here, a multi-band mask image is used to update
# corresponding input image band masks.
img_band_subset = img.select(['B4', 'B3', 'B2'])
band_specific_masks = img_band_subset.gt(200)
img_band_subset_masked = img_band_subset.updateMask(band_specific_masks)
display('Multi-band mask image', band_specific_masks)
display('Image, variable band masks', img_band_subset_masked)
m.add_ee_layer(band_specific_masks, None, 'Multi-band mask image')
m.add_ee_layer(
    img_band_subset_masked, true_color_viz, 'Image, variable band masks'
)
# Note that there is only a single alpha channel for visualization, so when
# the ee.Image is rendered as an RGB image or map tiles, a masked pixel in any
# band will result in transparency for all bands.

# Floating point mask values between 0 and 1 will be used to define opacity
# in visualization via m.add_ee_layer and ee.Image.visualize.
land_mask_float = land_mask.add(0.65)
img_masked_float = img.updateMask(land_mask_float)
display('Image, partially transparent', img_masked_float)
m.add_ee_layer(img_masked_float, true_color_viz, 'Image, partially transparent')
m
# [END earthengine__apidocs__ee_image_updatemask]
