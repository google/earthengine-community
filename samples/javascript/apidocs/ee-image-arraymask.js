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

// [START earthengine__apidocs__ee_image_arraymask]
// A function to print arrays for a selected pixel in the following examples.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([-121, 42]);
  return arrImg.sample(point, 500).first().get('array');
}

// Create a 1D array image with length 6.
var arrayImg1D = ee.Image([0, 1, 2, 4, 0, 5]).toArray();
print('1D array image (pixel)', sampArrImg(arrayImg1D));
// [0, 1, 2, 4, 0, 5]

// Create a mask using a relational operator to mask values greater than 2.
var mask1D = arrayImg1D.lte(2);
print('1D mask for greater than value 2 (pixel)', sampArrImg(mask1D));
// [1, 1, 1, 0, 1, 0]

var arrayImg1DMask = arrayImg1D.arrayMask(mask1D);
print('1D array image mask (pixel)', sampArrImg(arrayImg1DMask));
// [0, 1, 2, 0]

// Self mask the 1D array image. Value zero will be masked out.
var arrayImg1DselfMask = arrayImg1D.arrayMask(arrayImg1D);
print('1D array image self mask (pixel)', sampArrImg(arrayImg1DselfMask));
// [1, 2, 4, 5]

// Create a 2D array image.
var arrayImg2D = arrayImg1D.arrayReshape(ee.Image([2, 3]).toArray(), 2);
print('2D 2x3 array image (pixel)', sampArrImg(arrayImg2D));
// [[0, 1, 2],
//  [4, 0, 5]]

// Slice out a row to use as a column mask.
var rowAsMaskForCols = arrayImg2D.arraySlice(0, 1, 2);
print('2D mask for cols (pixel)', sampArrImg(rowAsMaskForCols));
// [[4, 0, 5]]

var arrayImg2DMaskCols = arrayImg2D.arrayMask(rowAsMaskForCols);
print('2D array image cols masked (pixel)', sampArrImg(arrayImg2DMaskCols));
// [[0, 2],
//  [4, 5]]

// Slice out a column to use as a row mask.
var colAsMaskForRows = arrayImg2D.arraySlice(1, 1, 2);
print('2D mask for rows (pixel)', sampArrImg(colAsMaskForRows));
// [[1],
//  [0]]

var arrayImg2DMaskRows = arrayImg2D.arrayMask(colAsMaskForRows);
print('2D array image rows masked (pixel)', sampArrImg(arrayImg2DMaskRows));
// [[0, 1, 2]]
// [END earthengine__apidocs__ee_image_arraymask]
