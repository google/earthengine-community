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

// [START earthengine__apidocs__ee_image_arrayflatten]
// A function to print arrays for a selected pixel in the following examples.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([-121, 42]);
  return arrImg.sample(point, 500).first().get('array');
}

// A 1D array image.
var arrayImg1D = ee.Image([0, 1, 2]).toArray();
print('1D array image (pixel)', sampArrImg(arrayImg1D));
// [0, 1, 2]

// Define image band names for a 1D array image with 3 rows. You are labeling
// all rows and columns using a list of lists; the 1st sub list defines labels
// for array rows and the 2nd (if applicable) defines labels for array columns.
var bandNames1D = [['row0', 'row1', 'row2']];

// Flatten the 1D array image into an image with n bands equal to all
// combinations of rows and columns. Here, we have 3 rows and 0 columns,
// so the result will be a 3-band image.
var imgFrom1Darray = arrayImg1D.arrayFlatten(bandNames1D);
print('Image from 1D array', imgFrom1Darray);

// Make a 2D array image by repeating the 1D array on 2-axis.
var arrayImg2D = arrayImg1D.arrayRepeat(1, 2);
print('2D array image (pixel)', sampArrImg(arrayImg2D));
// [[0, 0],
//  [1, 1],
//  [2, 2]]

// Define image band names for a 2D array image with 3 rows and 2 columns.
// Recall that you are labeling all rows and columns using a list of lists;
// The 1st sub list defines labels for array rows and the 2nd (if applicable)
// defines labels for array columns.
var bandNames2D = [['row0', 'row1', 'row2'], ['col0', 'col1']];

// Flatten the 2D array image into an image with n bands equal to all
// combinations of rows and columns. Here, we have 3 rows and 2 columns,
// so the result will be a 6-band image.
var imgFrom2Darray = arrayImg2D.arrayFlatten(bandNames2D);
print('Image from 2D array', imgFrom2Darray);
// [END earthengine__apidocs__ee_image_arrayflatten]
