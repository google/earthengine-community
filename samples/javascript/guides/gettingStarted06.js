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
 *   from 'Mapping (what to do instead of a for-loop)' section
 */

// [START earthengine__gettingStarted06__map_function]
// This function gets NDVI from Landsat 8 imagery.
var addNDVI = function(image) {
  return image.addBands(image.normalizedDifference(['B5', 'B4']));
};

// Load the Landsat 8 raw data, filter by location and date.
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1')
  .filterBounds(ee.Geometry.Point(-122.262, 37.8719))
  .filterDate('2014-06-01', '2014-10-01');

// Map the function over the collection.
var ndviCollection = collection.map(addNDVI);
// [END earthengine__gettingStarted06__map_function]

// Display the result.
var vizParams = {bands: ['nd'], min: -0.5, max: 1, palette: ['FF0000', '00FF00']};
var image = ndviCollection.mosaic();
Map.setCenter(-122.262, 37.8719, 13);
Map.addLayer(image, vizParams, 'NDVI');
