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

// [START earthengine__apidocs__ee_image_unmask]
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

// Set invalid masked pixels to a new value, e.g. a constant nodata value
// when exporting an image as GeoTIFF.
var imgUnmasked = imgMasked.unmask(32767);
print('Image, unmasked', imgMasked);
Map.addLayer(imgUnmasked, trueColorViz, 'Image, unmasked');

// Reset masked pixels to valid, fill with default value 0, input footprint.
var maskResetFootprint = imgMasked.unmask();
print('Image mask reset, footprint', maskResetFootprint);
Map.addLayer(maskResetFootprint, trueColorViz, 'Image mask reset, footprint');

// Reset masked pixels to valid, fill with default value 0, everywhere.
var maskResetEverywhere = imgMasked.unmask({sameFootprint: false});
print('Image mask reset, everywhere', maskResetEverywhere);
Map.addLayer(maskResetEverywhere, trueColorViz, 'Image mask reset, everywhere');

// Fill masked pixels with pixels from a different image.
var fill = ee.Image('COPERNICUS/S2_SR/20200618T184919_20200618T190341_T10SEG');
var imgFilled = imgMasked.unmask(fill);
print('Image, filled', imgFilled);
Map.addLayer(imgFilled, trueColorViz, 'Image, filled');
// [END earthengine__apidocs__ee_image_unmask]
