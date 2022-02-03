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
  [0.3029, 0.2786, 0.4733, 0.5599, 0.508, 0.1872],
  [-0.2941, -0.243, -0.5424, 0.7276, 0.0713, -0.1608],
  [0.1511, 0.1973, 0.3283, 0.3407, -0.7117, -0.4559],
  [-0.8239, 0.0849, 0.4396, -0.058, 0.2013, -0.2773],
  [-0.3294, 0.0557, 0.1056, 0.1855, -0.4349, 0.8085],
  [0.1079, -0.9023, 0.4119, 0.0575, -0.0259, 0.0252],
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
// Load a Landsat 8 image, select the bands of interest.
var image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')
  .select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7']);

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
Map.addLayer(image, {bands: ['B5', 'B4', 'B3'], min: 0, max: 0.5}, 'image');
Map.addLayer(greennessImage, {min: -0.1, max: 0.13}, 'greenness');
// [END earthengine__arrays01__array_get]
