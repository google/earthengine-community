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

// [START earthengine__apidocs__ee_image_toarray]
// A function to print arrays for a selected pixel in the following examples.
function sampArrImg(arrImg) {
  var point = ee.Geometry.Point([-121, 42]);
  return arrImg.sample(point, 500).first().get('array');
}

// A 3-band image of constants.
var img = ee.Image([0, 1, 2]);
print('3-band image', img);

// Convert the 3-band image to an array image. The resulting array image has a
// single band named "array". The "array" band stores the per-pixel band values
// from the input ee.Image as a 1D array.
var arrayImg1D = img.toArray();
print('1D array image', arrayImg1D);

// Sample a single pixel to see its 1D array using the `sampArrImg` function
// defined above. Similar arrays are present for all pixels in a given array
// image; looking at just one helps conceptualize the structure.
print('1D array image (pixel)', sampArrImg(arrayImg1D));
// [0, 1, 2]

// Array images can be displayed to the Code Editor map and queried with the
// inspector tool. Per-pixel, the first element in the array is shown.
// Single-band grayscale is used to represent the data. Style parameters `min`
// and `max` are valid. Styling the layer with the Code Editor's layer
// visualization tool is invalid.
Map.addLayer(arrayImg1D, {min: 0, max: 2}, 'Image array');

// Create a 2D array image by concatenating the values in a 1D array image
// along the 1-axis using `toArray(1)`. For a 3D array, apply `toArray(2)` to
// the result.
var arrayImg2D = arrayImg1D.toArray(1);
print('2D array image (pixel)', sampArrImg(arrayImg2D));
// [[0],
//  [1],
//  [2]]
// [END earthengine__apidocs__ee_image_toarray]
