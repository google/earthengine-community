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

// [START earthengine__apidocs__ee_image_arrayrepeat]
// A function to print the array for a selected pixel in the following examples.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([-121, 42]);
  return arrImg.sample(point, 500).first().get('array');
}

// Create a 1D array image.
var arrayImg1D = ee.Image([0, 1, 2]).toArray();
print('1D array image (pixel)', sampArrImg(arrayImg1D));
// [0, 1, 2]

// Repeat a 1D array along the 0-axis 3 times.
var repeat1DAx0 = arrayImg1D.arrayRepeat(0, 3);
print('1D array repeated 3 times on 0-axis', sampArrImg(repeat1DAx0));
// [0, 1, 2, 0, 1, 2, 0, 1, 2]

// Repeat a 1D array along the 1-axis 3 times (expands the dimensions).
var repeat1DAx1 = arrayImg1D.arrayRepeat(1, 3);
print('1D array repeated 3 times on 1-axis', sampArrImg(repeat1DAx1));
// [[0, 0, 0],
//  [1, 1, 1],
//  [2, 2, 2]]

// Repeat a 2D array along the 0-axis 2 times.
var repeat2DAx0 = repeat1DAx1.arrayRepeat(0, 2);
print('2D array repeated 2 times on 0-axis', sampArrImg(repeat2DAx0));
// [[0, 0, 0],
//  [1, 1, 1],
//  [2, 2, 2],
//  [0, 0, 0],
//  [1, 1, 1],
//  [2, 2, 2]]

// Repeat a 2D array along the 1-axis 2 times.
var repeat2DAx1 = repeat1DAx1.arrayRepeat(1, 2);
print('2D array repeated 2 times on 1-axis', sampArrImg(repeat2DAx1));
// [[0, 0, 0, 0, 0, 0],
//  [1, 1, 1, 1, 1, 1],
//  [2, 2, 2, 2, 2, 2]]
// [END earthengine__apidocs__ee_image_arrayrepeat]
