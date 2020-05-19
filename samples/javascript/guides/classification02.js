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
 *   from 'Classification - Supervised Classification' section
 */

// [START earthengine__classification02__polygon_training]
// Make a cloud-free Landsat 8 TOA composite (from raw imagery).
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1');

var image = ee.Algorithms.Landsat.simpleComposite({
  collection: l8.filterDate('2018-01-01', '2018-12-31'),
  asFloat: true
});

// Use these bands for prediction.
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'B11'];

// Manually created polygons.
var forest1 = ee.Geometry.Rectangle(-63.0187, -9.3958, -62.9793, -9.3443);
var forest2 = ee.Geometry.Rectangle(-62.8145, -9.206, -62.7688, -9.1735);
var nonForest1 = ee.Geometry.Rectangle(-62.8161, -9.5001, -62.7921, -9.4486);
var nonForest2 = ee.Geometry.Rectangle(-62.6788, -9.044, -62.6459, -8.9986);

// Make a FeatureCollection from the hand-made geometries.
var polygons = ee.FeatureCollection([
  ee.Feature(nonForest1, {'class': 0}),
  ee.Feature(nonForest2, {'class': 0}),
  ee.Feature(forest1, {'class': 1}),
  ee.Feature(forest2, {'class': 1}),
]);

// Get the values for all pixels in each polygon in the training.
var training = image.sampleRegions({
  // Get the sample from the polygons FeatureCollection.
  collection: polygons,
  // Keep this list of properties from the polygons.
  properties: ['class'],
  // Set the scale to get Landsat pixels in the polygons.
  scale: 30
});

// Create an SVM classifier with custom parameters.
var classifier = ee.Classifier.libsvm({
  kernelType: 'RBF',
  gamma: 0.5,
  cost: 10
});

// Train the classifier.
var trained = classifier.train(training, 'class', bands);

// Classify the image.
var classified = image.classify(trained);

// Display the classification result and the input image.
Map.setCenter(-62.836, -9.2399, 9);
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], max: 0.5, gamma: 2});
Map.addLayer(polygons, {}, 'training polygons');
Map.addLayer(classified,
             {min: 0, max: 1, palette: ['red', 'green']},
             'deforestation');
// [END earthengine__classification02__polygon_training]
