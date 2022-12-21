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

// [START earthengine__apidocs__ee_image_arrayreshape]
// A function to print arrays for a selected pixel in the following examples.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([-121, 42]);
  return arrImg.sample(point, 500).first().get('array');
}

// Create a 1D array image with length 6.
var arrayImg1D = ee.Image([0, 1, 2, 3, 4, 5]).toArray();
print('1D array image (pixel)', sampArrImg(arrayImg1D));
// [0, 1, 2, 3, 4, 5]

// Reshape the 1D 6-element array to a 2D 2 (row) x 3 (column) array. Notice
// that elements are filled row by row in the reshaped result.
var reshape2x3 = arrayImg1D.arrayReshape(ee.Image([2, 3]).toArray(), 2);
print('2D 2x3 array image (pixel)', sampArrImg(reshape2x3));
// [[0, 1, 2],
//  [3, 4, 5]]

// Use -1 to auto-determine a dimension length. For example, here we set
// 3 rows and let Earth Engine determine the number of columns needed.
var reshape3x_ = arrayImg1D.arrayReshape(ee.Image([3, -1]).toArray(), 2);
print('2D 3x? array image (pixel)', sampArrImg(reshape3x_));
// [[0, 1],
//  [2, 3],
//  [4, 5]]

// Flatten a 2D 2x3 array to 1D 6-element array.
var flattened = reshape2x3.arrayReshape(ee.Image([-1]).toArray(), 1);
print('2D array flattened to 1D', sampArrImg(flattened));
// [0, 1, 2, 3, 4, 5]
// [END earthengine__apidocs__ee_image_arrayreshape]
