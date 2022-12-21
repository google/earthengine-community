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

// [START earthengine__apidocs__ee_image_arraylengths]
// A function to print arrays for a selected pixel in the following examples.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([-121, 42]);
  return arrImg.sample(point, 500).first().get('array');
}

// A 3-band image of constants.
var img = ee.Image([0, 1, 2]);
print('3-band image', img);

// Convert the 3-band image to a 2D array image.
var arrayImg2D = img.toArray().toArray(1);
print('2D array image (pixel)', sampArrImg(arrayImg2D));
// [[0],
//  [1],
//  [2]]

// Get the number of dimensions in each pixel's array.
var arrayImg2Ddim = arrayImg2D.arrayDimensions();
print('N dimensions in array', sampArrImg(arrayImg2Ddim));
// 2

// Get the array length per dimension per pixel.
var arrayImg2DdimLen = arrayImg2D.arrayLengths();
print('Array length per dimension', sampArrImg(arrayImg2DdimLen));
// [3, 1]

// Get the array length for 0-axis (rows).
var arrayImg2Daxis0Len = arrayImg2D.arrayLength(0);
print('Array length 0-axis (rows)', sampArrImg(arrayImg2Daxis0Len));
// 3

// Get the array length for 1-axis (columns).
var arrayImg2Daxis1Len = arrayImg2D.arrayLength(1);
print('Array length 1-axis (columns)', sampArrImg(arrayImg2Daxis1Len));
// 1
// [END earthengine__apidocs__ee_image_arraylengths]
