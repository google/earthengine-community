/**
 * Copyright 2021 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START earthengine__apidocs__ee_image_updatemask]
// A Sentinel-2 surface reflectance image.
var img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG');
var trueColorViz = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 2700,
  gamma: 1.3
};
print('Sentinel-2 image', img);
Map.setCenter(-122.36, 37.47, 10);
Map.addLayer(img, trueColorViz, 'Sentinel-2 image');

// Create a Boolean land mask from the SWIR1 band; water is value 0, land is 1.
var landMask = img.select('B11').gt(100);
print('Land mask', landMask);
Map.addLayer(landMask, {palette: ['blue', 'lightgreen']}, 'Land mask');

// Apply the single-band land mask to all image bands; pixel values equal to 0
// in the mask become invalid in the image.
var imgMasked = img.updateMask(landMask);
print('Image, land only', imgMasked);
Map.addLayer(imgMasked, trueColorViz, 'Image, land only');

// Masks are band-specific. Here, a multi-band mask image is used to update
// corresponding input image band masks.
var imgBandSubset = img.select(['B4', 'B3', 'B2']);
var bandSpecificMasks = imgBandSubset.gt(200);
var imgBandSubsetMasked = imgBandSubset.updateMask(bandSpecificMasks);
print('Multi-band mask image', bandSpecificMasks);
print('Image, variable band masks', imgBandSubsetMasked);
Map.addLayer(bandSpecificMasks, null, 'Multi-band mask image');
Map.addLayer(imgBandSubsetMasked, trueColorViz, 'Image, variable band masks');
// Note that there is only a single alpha channel for visualization, so when
// the ee.Image is rendered as an RGB image or map tiles, a masked pixel in any
// band will result in transparency for all bands.

// Floating point mask values between 0 and 1 will be used to define opacity
// in visualization via Map.addLayer and ee.Image.visualize.
var landMaskFloat = landMask.add(0.65);
var imgMaskedFloat = img.updateMask(landMaskFloat);
print('Image, partially transparent', imgMaskedFloat);
Map.addLayer(imgMaskedFloat, trueColorViz, 'Image, partially transparent');
// [END earthengine__apidocs__ee_image_updatemask]
