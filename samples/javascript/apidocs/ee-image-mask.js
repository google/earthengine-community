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

// [START earthengine__apidocs__ee_image_mask]
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

// Get masks for all image bands; each band has an independent mask.
// Valid pixels are value 1, invalid are 0.
var multiBandMaskImg = img.mask();
print('Multi-band mask image', multiBandMaskImg);
Map.addLayer(multiBandMaskImg, null, 'Multi-band mask image');

// Get the mask for a single image band.
var singleBandMaskImg = img.select('B1').mask();
print('Single-band mask image', singleBandMaskImg);
Map.addLayer(singleBandMaskImg, null, 'Single-band mask image');
// [END earthengine__apidocs__ee_image_mask]
