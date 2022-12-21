/**
 * Copyright 2022 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_image_arraydotproduct]
// A function to print arrays for a selected pixel in the following examples.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([-121, 42]);
  return arrImg.sample(point, 500).first().get('array');
}

// A 1D array image.
var arrayImg1Da = ee.Image([0, 1, 2]).toArray();
print('1D array image A (pixel)', sampArrImg(arrayImg1Da));
// [0, 1, 2]

// A second 1D array image of the same length.
var arrayImg1Db = ee.Image([3, 4, 5]).toArray();
print('1D array image B (pixel)', sampArrImg(arrayImg1Db));
// [3, 4, 5]

// Calculate the dot product for the two 1D arrays.
var test = arrayImg1Da.arrayDotProduct(arrayImg1Db);
print('A⋅B = 0(3) + 1(4) + 2(5) = ', sampArrImg(test));
// 14
// [END earthengine__apidocs__ee_image_arraydotproduct]
