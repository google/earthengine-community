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

// [START earthengine__apidocs__ee_image_arraycat]
// A function to print arrays for a selected pixel in the following examples.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([-121, 42]);
  return arrImg.sample(point, 500).first().get('array');
}

// Create two 1D array images.
var arrayImg1Da = ee.Image([0, 1, 2]).toArray();
print('1D array image (A) (pixel)', sampArrImg(arrayImg1Da));
// [0, 1, 2]
var arrayImg1Db = ee.Image([3, 4, 5]).toArray();
print('1D array image (B) (pixel)', sampArrImg(arrayImg1Db));
// [3, 4, 5]

// Concatenate 1D array image B to 1D array image A on 0-axis (rows).
var arrayImg1DcatAx0 = arrayImg1Da.arrayCat(arrayImg1Db, 0);
print('Concatenate 1D array images on 0-axis', sampArrImg(arrayImg1DcatAx0));
// [0, 1, 2, 3, 4, 5]

// Concatenate 1D array image B to 1D array image A on 1-axis (columns).
var arrayImg1DcatAx1 = arrayImg1Da.arrayCat(arrayImg1Db, 1);
print('Concatenate 1D array images on 1-axis', sampArrImg(arrayImg1DcatAx1));
// [[0, 3],
//  [1, 4]
//  [2, 5]]

// Create two 2D array images (expand the dimensions of 1D arrays).
var arrayImg2Da = arrayImg1Da.toArray(1);
print('2D array image (A) (pixel)', sampArrImg(arrayImg2Da));
// [[0],
//  [1],
//  [2]]
var arrayImg2Db = arrayImg1Db.toArray(1);
print('2D array image (B) (pixel)', sampArrImg(arrayImg2Db));
// [[3],
//  [4],
//  [5]]

// Concatenate 2D array image B to 2D array image A on 0-axis (rows).
var arrayImg2DcatAx0 = arrayImg2Da.arrayCat(arrayImg2Db, 0);
print('Concatenate 2D array images on 0-axis', sampArrImg(arrayImg2DcatAx0));
// [[0],
//  [1],
//  [2],
//  [3],
//  [4],
//  [5]]

// Concatenate 2D array image B to 2D array image A on 1-axis (columns).
var arrayImg2DcatAx1 = arrayImg2Da.arrayCat(arrayImg2Db, 1);
print('Concatenate 2D array images on 1-axis', sampArrImg(arrayImg2DcatAx1));
// [[0, 3],
//  [1, 4],
//  [2, 5]]
// [END earthengine__apidocs__ee_image_arraycat]
