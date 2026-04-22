/**
 * Copyright 2026 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_imagecollection_toarrayperband]
// A function to extract and print the array of a selected pixel.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([0, 0]);
  return arrImg.sample(point, 1).first().get('b1');
}

// Define three single-band constant images with unified data types.
var img0 = ee.Image(0).byte().rename('b1');
var img1 = ee.Image(1).byte().rename('b1');
var img2 = ee.Image(2).byte().rename('b1');

// 1. Basic usage: concatenate fully valid images along axis 0.
var colSimple = ee.ImageCollection([img0, img1, img2]);

var arrayBasic = colSimple.toArrayPerBand();
print('Basic toArrayPerBand (pixel array):', sampArrImg(arrayBasic));
// Result: [0, 1, 2]

// 2. Masking behavior: introduce an image with a masked pixel.
// Update mask so img1 has no valid data at the sampled pixel.
var img1Masked = img1.updateMask(0);
var colMasked = ee.ImageCollection([img0, img1Masked, img2]);

// By default (dropMasked = false), if any input image is masked at a pixel,
// the output array is masked at that pixel. Since sampling a masked pixel
// returns no features, we inspect the output image's mask directly.
var arrayDefault = colMasked.toArrayPerBand();
print('Default masking behavior (pixel mask is 0):',
      sampArrImg(arrayDefault.mask()));
// Result: 0

// With dropMasked = true, completely masked images at a pixel are ignored,
// and only the unmasked images contribute to the output array.
var arrayDropped = colMasked.toArrayPerBand(0, true);
print('dropMasked=true (pixel array ignores masked images):',
      sampArrImg(arrayDropped));
// Result: [0, 2]
// [END earthengine__apidocs__ee_imagecollection_toarrayperband]

