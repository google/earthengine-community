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
// Define a function that scales and masks Landsat 8 surface reflectance images.
function prepSrL8(image) {
  // Develop masks for unwanted pixels (fill, cloud, cloud shadow).
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);

  // Apply the scaling factors to the appropriate bands.
  var getFactorImg = function(factorNames) {
    var factorList = image.toDictionary().select(factorNames).values();
    return ee.Image.constant(factorList);
  };
  var scaleImg = getFactorImg([
    'REFLECTANCE_MULT_BAND_.|TEMPERATURE_MULT_BAND_ST_B10']);
  var offsetImg = getFactorImg([
    'REFLECTANCE_ADD_BAND_.|TEMPERATURE_ADD_BAND_ST_B10']);
  var scaled = image.select('SR_B.|ST_B10').multiply(scaleImg).add(offsetImg);

  // Replace original bands with scaled bands and apply masks.
  return image.addBands(scaled, null, true)
    .updateMask(qaMask).updateMask(saturationMask);
}

// Make a cloud-free Landsat 8 surface reflectance composite.
var image = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterDate('2018-01-01', '2019-01-01')
  .map(prepSrL8)
  .median();

// Use these bands for prediction.
var bands = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5',
             'SR_B6', 'SR_B7'];

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
Map.addLayer(image,
             {bands: ['SR_B4', 'SR_B3', 'SR_B2'], min: 0, max: 0.25},
             'image');
Map.addLayer(polygons, {color: 'yellow'}, 'training polygons');
Map.addLayer(classified,
             {min: 0, max: 1, palette: ['orange', 'green']},
             'deforestation');
// [END earthengine__classification02__polygon_training]
