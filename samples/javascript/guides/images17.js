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
 *   from 'Images - Texture' page
 */

// [START earthengine__images17__entropy]
// Load a high-resolution NAIP image.
var image = ee.Image('USDA/NAIP/DOQQ/m_3712213_sw_10_1_20140613');

// Zoom to San Francisco, display.
Map.setCenter(-122.466123, 37.769833, 17);
Map.addLayer(image, {max: 255}, 'image');

// Get the NIR band.
var nir = image.select('N');

// Define a neighborhood with a kernel.
var square = ee.Kernel.square({radius: 4});

// Compute entropy and display.
var entropy = nir.entropy(square);
Map.addLayer(entropy,
             {min: 1, max: 5, palette: ['0000CC', 'CC0000']},
             'entropy');
// [END earthengine__images17__entropy]

// [START earthengine__images17__glcm]
// Compute the gray-level co-occurrence matrix (GLCM), get contrast.
var glcm = nir.glcmTexture({size: 4});
var contrast = glcm.select('N_contrast');
Map.addLayer(contrast,
             {min: 0, max: 1500, palette: ['0000CC', 'CC0000']},
             'contrast');
// [END earthengine__images17__glcm]

// [START earthengine__images17__gearys]
// Create a list of weights for a 9x9 kernel.
var row = [1, 1, 1, 1, 1, 1, 1, 1, 1];
// The center of the kernel is zero.
var centerRow = [1, 1, 1, 1, 0, 1, 1, 1, 1];
// Assemble a list of lists: the 9x9 kernel weights as a 2-D matrix.
var rows = [row, row, row, row, centerRow, row, row, row, row];
// Create the kernel from the weights.
// Non-zero weights represent the spatial neighborhood.
var kernel = ee.Kernel.fixed(9, 9, rows, -4, -4, false);

// Convert the neighborhood into multiple bands.
var neighs = nir.neighborhoodToBands(kernel);

// Compute local Geary's C, a measure of spatial association.
var gearys = nir.subtract(neighs).pow(2).reduce(ee.Reducer.sum())
             .divide(Math.pow(9, 2));
Map.addLayer(gearys,
             {min: 20, max: 2500, palette: ['0000CC', 'CC0000']},
             "Geary's C");
// [END earthengine__images17__gearys]
