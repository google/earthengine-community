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
 *   from 'Images - Convolutions' page
 */

// [START earthengine__images10__smoothing]
// Load and display an image.
var image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');
Map.setCenter(-121.9785, 37.8694, 11);
Map.addLayer(image, {bands: ['B5', 'B4', 'B3'], max: 0.5}, 'input image');

// Define a boxcar or low-pass kernel.
var boxcar = ee.Kernel.square({
  radius: 7, units: 'pixels', normalize: true
});

// Smooth the image by convolving with the boxcar kernel.
var smooth = image.convolve(boxcar);
Map.addLayer(smooth, {bands: ['B5', 'B4', 'B3'], max: 0.5}, 'smoothed');
// [END earthengine__images10__smoothing]

// [START earthengine__images10__edges]
// Define a Laplacian, or edge-detection kernel.
var laplacian = ee.Kernel.laplacian8({ normalize: false });

// Apply the edge-detection kernel.
var edgy = image.convolve(laplacian);
Map.addLayer(edgy,
             {bands: ['B5', 'B4', 'B3'], max: 0.5, format: 'png'},
             'edges');
// [END earthengine__images10__edges]

// [START earthengine__images10__fixed]
// Create a list of weights for a 9x9 kernel.
var row = [1, 1, 1, 1, 1, 1, 1, 1, 1];
// The center of the kernel is zero.
var centerRow = [1, 1, 1, 1, 0, 1, 1, 1, 1];
// Assemble a list of lists: the 9x9 kernel weights as a 2-D matrix.
var rows = [row, row, row, row, centerRow, row, row, row, row];
// Create the kernel from the weights.
var kernel = ee.Kernel.fixed(9, 9, rows, -4, -4, false);
print(kernel);
// [END earthengine__images10__fixed]
