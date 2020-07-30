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
 *   from 'Band Math' and 'Masking' sections
 */

// [START earthengine__gettingStarted05__band_math]
// This function gets NDVI from Landsat 5 imagery.
var getNDVI = function(image) {
  return image.normalizedDifference(['B4', 'B3']);
};

// Load two Landsat 5 images, 20 years apart.
var image1 = ee.Image('LANDSAT/LT05/C01/T1_TOA/LT05_044034_19900604');
var image2 = ee.Image('LANDSAT/LT05/C01/T1_TOA/LT05_044034_20100611');

// Compute NDVI from the scenes.
var ndvi1 = getNDVI(image1);
var ndvi2 = getNDVI(image2);

// Compute the difference in NDVI.
var ndviDifference = ndvi2.subtract(ndvi1);
// [END earthengine__gettingStarted05__band_math]

// [START earthengine__gettingStarted05__masking]
// Load the land mask from the SRTM DEM.
var landMask = ee.Image('CGIAR/SRTM90_V4').mask();

// Update the NDVI difference mask with the land mask.
var maskedDifference = ndviDifference.updateMask(landMask);

// Display the masked result.
var vizParams = {min: -0.5, max: 0.5, palette: ['FF0000', 'FFFFFF', '0000FF']};
Map.setCenter(-122.2531, 37.6295, 9);
Map.addLayer(maskedDifference, vizParams, 'NDVI difference');
// [END earthengine__gettingStarted05__masking]
