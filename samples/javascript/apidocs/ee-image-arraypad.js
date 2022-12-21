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

// [START earthengine__apidocs__ee_image_arraypad]
// A function to print the array for a selected pixel in the following examples.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([-121, 42]);
  return arrImg.sample(point, 500).first().get('array');
}

// Create a 1D array image.
var arrayImg1D = ee.Image([0, 1, 2]).toArray();
print('1D array image (pixel)', sampArrImg(arrayImg1D));
// [0, 1, 2]

// Pad 1D array to length of 5 with value 9.
var arrayImg1Dpad = arrayImg1D.arrayPad([5], 9);
print('1D array image padded', sampArrImg(arrayImg1Dpad));
// [0, 1, 2, 9, 9]

// Create a 2D array image.
var arrayImg2D = ee.Image([0, 1, 2, 3, 4, 5]).toArray()
  .arrayReshape(ee.Image([2, 3]).toArray(), 2);
print('2D 2x3 array image (pixel)', sampArrImg(arrayImg2D));
// [[0, 1, 2],
//  [3, 4, 5]]

// Pad 2D array to 0-axis length 3 and 1-axis length 5 with value 9.
var arrayImg2Dpad = arrayImg2D.arrayPad([3, 5], 9);
print('2D array image padded', sampArrImg(arrayImg2Dpad));
// [[0, 1, 2, 9, 9],
//  [3, 4, 5, 9, 9],
//  [9, 9, 9, 9, 9]]
// [END earthengine__apidocs__ee_image_arraypad]
