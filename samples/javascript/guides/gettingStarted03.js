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
 *   from 'Adding data to the map' section
 */

// [START earthengine__gettingStarted03__image_display]
// Load an image.
var image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318');

// Center the map on the image.
Map.centerObject(image, 9);

// Display the image.
Map.addLayer(image);
// [END earthengine__gettingStarted03__image_display]

// [START earthengine__gettingStarted03__image_visualization]
// Load the image from the archive.
var image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318');

// Define visualization parameters in an object literal.
var vizParams = {bands: ['B5', 'B4', 'B3'], min: 5000, max: 15000, gamma: 1.3};

// Center the map on the image and display.
Map.centerObject(image, 9);
Map.addLayer(image, vizParams, 'Landsat 8 false color');
// [END earthengine__gettingStarted03__image_visualization]

// [START earthengine__gettingStarted03__fc_display]
var counties = ee.FeatureCollection('TIGER/2016/Counties');
Map.addLayer(counties, {}, 'counties');
// [END earthengine__gettingStarted03__fc_display]
