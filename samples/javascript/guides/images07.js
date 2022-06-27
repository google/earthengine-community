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
 *   from 'Images - Relational, conditional and Boolean operations' page
 */

// [START earthengine__images07__thresholding]
// Load a Landsat 8 image.
var image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');

// Create NDVI and NDWI spectral indices.
var ndvi = image.normalizedDifference(['B5', 'B4']);
var ndwi = image.normalizedDifference(['B3', 'B5']);

// Create a binary layer using logical operations.
var bare = ndvi.lt(0.2).and(ndwi.lt(0));

// Mask and display the binary layer.
Map.setCenter(-122.3578, 37.7726, 12);
Map.setOptions('satellite');
Map.addLayer(bare.selfMask(), {}, 'bare');
// [END earthengine__images07__thresholding]
