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

// [START earthengine__apidocs__ee_image_arraysort]
// A function to print arrays for a selected pixel in the following examples.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([-121, 42]);
  return arrImg.sample(point, 500).first().get('array');
}

// Create a 1D array image with length 12.
var arrayImg1D = ee.Image([0, 10, 6, 5, 4, 7, 11, 1, 2, 9, 8, 3]).toArray();
print('1D array image (pixel)', sampArrImg(arrayImg1D));
// [0, 10, 6, 5, 4, 7, 11, 1, 2, 9, 8, 3]

// Sort the 1D array in ascending order.
var arrayImg1DSorted = arrayImg1D.arraySort();
print('1D array image sorted (pixel)', sampArrImg(arrayImg1DSorted));
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

// You can use another array image to control sorting. The order of values
// in the optional keys array translates to relative position in the input
// array. For example, here is a keys array image with non-sequential values in
// descending order, it will reverse the order of the input array; make the
// last position first and the first position last.
var keys1D = ee.Image([99, 98, 50, 45, 23, 18, 9, 8, 7, 5, 2, 0]).toArray();
print('1D array image keys (pixel)', sampArrImg(keys1D));
// [99, 98, 50, 45, 23, 18, 9, 8, 7, 5, 2, 0]
var arrayImg1DSortedKeys = arrayImg1D.arraySort(keys1D);
print('1D array image sorted by keys (pixel)', sampArrImg(arrayImg1DSortedKeys));
// [3, 8, 9, 2, 1, 11, 7, 4, 5, 6, 10, 0]

// To sort a 2D array, the keys array image is required.
// Create a 2D array image with 3 rows and 4 columns.
var arrayImg2D = arrayImg1D.arrayReshape(ee.Image([3, 4]).toArray(), 2);
print('2D array image (pixel)', sampArrImg(arrayImg2D));
// [[0, 10,  6, 5],
//  [4,  7, 11, 1],
//  [2,  9,  8, 3]]

// Only a single axis can be sorted at a time. Here, we reverse sort along rows.
// There are 4 elements in each row, so we construct an 1x4 array image.
var keys2Drows = ee.Image([3, 2, 1, 0]).toArray().toArray(1).arrayTranspose();
print('2D array image row keys (pixel)', sampArrImg(keys2Drows));
// [[3, 2, 1, 0]]
var arrayImg2DSortedRows = arrayImg2D.arraySort(keys2Drows);
print('2D array image sorted rows (pixel)', sampArrImg(arrayImg2DSortedRows));
// [[5,  6, 10, 0],
//  [1, 11,  7, 4],
//  [3,  8,  9, 2]]

// Reverse sort along columns, create a 3x1 keys array image with values in
// descending order.
var keys2Dcols = ee.Image([2, 1, 0]).toArray().toArray(1);
print('2D array image column keys (pixel)', sampArrImg(keys2Dcols));
// [[2],
//  [1],
//  [0]]
var arrayImg2DSortedCols = arrayImg2D.arraySort(keys2Dcols);
print('2D array image sorted cols (pixel)', sampArrImg(arrayImg2DSortedCols));
// [[2,  9,  8, 3],
//  [4,  7, 11, 1],
//  [0, 10,  6, 5]]
// [END earthengine__apidocs__ee_image_arraysort]
