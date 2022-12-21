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

// [START earthengine__apidocs__ee_image_arrayargmax]
// A function to print the array for a selected pixel in the following examples.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([-121, 42]);
  return arrImg.sample(point, 500).first().get('array');
}

// Create a 1D array image.
var arrayImg1D = ee.Image([0, 1, 5, 2, 3, 4]).toArray();
print('1D array image (pixel)', sampArrImg(arrayImg1D));
// [0, 1, 5, 2, 3, 4]

// Get the position of the maximum value in a 1D array.
var maxValue1D = arrayImg1D.arrayArgmax();
print('Position of the maximum 1D array value', sampArrImg(maxValue1D));
// [2]

// Create a 2D 2x3 array image (reshape the 1D array image).
var arrayImg2D = arrayImg1D.arrayReshape(ee.Image([2, 3]).toArray(), 2);
print('2D 2x3 array image (pixel)', sampArrImg(arrayImg2D));
// [[0, 1, 5],
//  [2, 3, 4]]

// Get the position of the maximum value in a 2D array.
var maxValue2D = arrayImg2D.arrayArgmax();
print('Position of the maximum 2D array value', sampArrImg(maxValue2D));
// [0, 2]
// [END earthengine__apidocs__ee_image_arrayargmax]
