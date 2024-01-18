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

// [START earthengine__apidocs__ee_image_arrayreduce]
// A function to print arrays for a selected pixel in the following examples.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([-121, 42]);
  return arrImg.sample(point, 500).first().get('array');
}

// Create a 1D array image with length 6.
var arrayImg1D = ee.Image([0, 1, 2, 3, 4, 5]).toArray();
print('1D array image (pixel)', sampArrImg(arrayImg1D));
// [0, 1, 2, 3, 4, 5]

// Sum the elements in the 1D array image.
var arrayImg1Dsum = arrayImg1D.arrayReduce(ee.Reducer.sum(), [0]);
print('1D array image sum (pixel)', sampArrImg(arrayImg1Dsum));
// [15]

// Create a 2D array image with 2 rows and 3 columns.
var arrayImg2D = arrayImg1D.arrayReshape(ee.Image([2, 3]).toArray(), 2);
print('2D array image (pixel)', sampArrImg(arrayImg2D));
// [[0, 1, 2],
//  [3, 4, 5]]

// Sum 2D array image along 0-axis.
var arrayImg2DsumRow = arrayImg2D.arrayReduce(ee.Reducer.sum(), [0]);
print('2D array image sum rows (pixel)', sampArrImg(arrayImg2DsumRow));
// [[3, 5, 7]]

// Sum 2D array image along 1-axis.
var arrayImg2DsumCol = arrayImg2D.arrayReduce(ee.Reducer.sum(), [1]);
print('2D array image sum columns (pixel)', sampArrImg(arrayImg2DsumCol));
// [[3],
//  [12]]

// Sum 2D array image 0-axis and 1-axis.
var arrayImg2DsumRowCol = arrayImg2D.arrayReduce(ee.Reducer.sum(), [0, 1]);
print('2D array image sum columns (pixel)', sampArrImg(arrayImg2DsumRowCol));
// [[15]]

// For reducers that provide several outputs (like minMax and percentile),
// you need to ensure you have a dimension to hold the results. For instance,
// if you want minMax for a 1D array, add a second dimension.
var arrayImg1Dto2D = arrayImg1D.toArray(1);
print('1D array image to 2D', sampArrImg(arrayImg1Dto2D));
// [[0],
//  [1],
//  [2],
//  [3],
//  [4],
//  [5]]

// Calculate min and max for 2D array, use the fieldAxis parameter.
var minMax1D = arrayImg1Dto2D.arrayReduce(ee.Reducer.minMax(), [0], 1);
print('1D array image minMax (pixel)', sampArrImg(minMax1D));
// [[0, 5]]

// If your array image is 2D and you want min and max, add a third dimension.
var arrayImg2Dto3D = arrayImg2D.toArray(2);
print('2D array image to 3D', sampArrImg(arrayImg2Dto3D));
// [[[0], [1], [2]],
//  [[3], [4], [5]]]

// Calculate min and max along the 0-axis, store results in 2-axis.
var minMax2D = arrayImg2Dto3D.arrayReduce(ee.Reducer.minMax(), [0], 2);
print('2D array image minMax (pixel)', sampArrImg(minMax2D));
// [[[0, 3],
//   [1, 4],
//   [2, 5]]]
// [END earthengine__apidocs__ee_image_arrayreduce]
