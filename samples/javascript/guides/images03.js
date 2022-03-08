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
 *   from 'Images - Visualization' page
 */

// [START earthengine__images03__viz_image]
// Load an image.
var image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');

// Define the visualization parameters.
var vizParams = {
  bands: ['B5', 'B4', 'B3'],
  min: 0,
  max: 0.5,
  gamma: [0.95, 1.1, 1]
};

// Center the map and display the image.
Map.setCenter(-122.1899, 37.5010, 10); // San Francisco Bay
Map.addLayer(image, vizParams, 'false color composite');
// [END earthengine__images03__viz_image]

// [START earthengine__images03__palette]
// Load an image.
var image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');

// Create an NDWI image, define visualization parameters and display.
var ndwi = image.normalizedDifference(['B3', 'B5']);
var ndwiViz = {min: 0.5, max: 1, palette: ['00FFFF', '0000FF']};
Map.addLayer(ndwi, ndwiViz, 'NDWI', false);
// [END earthengine__images03__palette]

// [START earthengine__images03__mask]
// Mask the non-watery parts of the image, where NDWI < 0.4.
var ndwiMasked = ndwi.updateMask(ndwi.gte(0.4));
Map.addLayer(ndwiMasked, ndwiViz, 'NDWI masked');
// [END earthengine__images03__mask]

// [START earthengine__images03__visualize]
// Create visualization layers.
var imageRGB = image.visualize({bands: ['B5', 'B4', 'B3'], max: 0.5});
var ndwiRGB = ndwiMasked.visualize({
  min: 0.5,
  max: 1,
  palette: ['00FFFF', '0000FF']
});
// [END earthengine__images03__visualize]

// [START earthengine__images03__mosaic]
// Mosaic the visualization layers and display (or export).
var mosaic = ee.ImageCollection([imageRGB, ndwiRGB]).mosaic();
Map.addLayer(mosaic, {}, 'mosaic');
// [END earthengine__images03__mosaic]

// [START earthengine__images03__clip]
// Create a circle by drawing a 20000 meter buffer around a point.
var roi = ee.Geometry.Point([-122.4481, 37.7599]).buffer(20000);

// Display a clipped version of the mosaic.
Map.addLayer(mosaic.clip(roi), null, 'mosaic clipped');
// [END earthengine__images03__clip]
