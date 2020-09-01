/**
 * Copyright 2020 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Earth Engine Developer's Guide examples
 *   from 'Arrays - Arrays and Array Images' section
 */

// [START earthengine__arrays01__tc_array]
// Create an Array of Tasseled Cap coefficients.
var coefficients = ee.Array([
  [0.3037, 0.2793, 0.4743, 0.5585, 0.5082, 0.1863],
  [-0.2848, -0.2435, -0.5436, 0.7243, 0.0840, -0.1800],
  [0.1509, 0.1973, 0.3279, 0.3406, -0.7112, -0.4572],
  [-0.8242, 0.0849, 0.4392, -0.0580, 0.2012, -0.2768],
  [-0.3280, 0.0549, 0.1075, 0.1855, -0.4357, 0.8085],
  [0.1084, -0.9022, 0.4120, 0.0573, -0.0251, 0.0238]
]);
// [END earthengine__arrays01__tc_array]

// [START earthengine__arrays01__dimensions]
// Print the dimensions.
print(coefficients.length()); //    [6,6]
// [END earthengine__arrays01__dimensions]

// [START earthengine__arrays01__slice]
// Get the 1x6 greenness slice, display it.
var greenness = coefficients.slice({axis: 0, start: 1, end: 2, step: 1});
print(greenness);
// [END earthengine__arrays01__slice]

// [START earthengine__arrays01__array_image]
// Load a Landsat 5 image, select the bands of interest.
var image = ee.Image('LANDSAT/LT05/C01/T1_TOA/LT05_044034_20081011')
  .select(['B1', 'B2', 'B3', 'B4', 'B5', 'B7']);

// Make an Array Image, with a 1-D Array per pixel.
var arrayImage1D = image.toArray();

// Make an Array Image with a 2-D Array per pixel, 6x1.
var arrayImage2D = arrayImage1D.toArray(1);
// [END earthengine__arrays01__array_image]

// [START earthengine__arrays01__multiplication]
// Do a matrix multiplication: 1x6 times 6x1.
// Cast the greenness Array to an Image prior to multiplication.
var greennessArrayImage = ee.Image(greenness).matrixMultiply(arrayImage2D);
// [END earthengine__arrays01__multiplication]

// [START earthengine__arrays01__array_get]
// Get the result from the 1x1 array in each pixel of the 2-D array image.
var greennessImage = greennessArrayImage.arrayGet([0, 0]);

// Display the input imagery with the greenness result.
Map.setCenter(-122.3, 37.562, 10);
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.5}, 'image');
Map.addLayer(greennessImage, {min: -0.1, max: 0.1}, 'greenness');
// [END earthengine__arrays01__array_get]
