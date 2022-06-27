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

// [START earthengine__classification01__image_classify]
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
  .filterDate('2021-03-01', '2021-07-01')
  .map(prepSrL8)
  .median();

// Use these bands for prediction.
var bands = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5',
             'SR_B6', 'SR_B7', 'ST_B10'];

// Load training points. The numeric property 'class' stores known labels.
var points = ee.FeatureCollection('GOOGLE/EE/DEMOS/demo_landcover_labels');

// This property stores the land cover labels as consecutive
// integers starting from zero.
var label = 'landcover';

// Overlay the points on the imagery to get training.
var training = image.select(bands).sampleRegions({
  collection: points,
  properties: [label],
  scale: 30
});

// Train a CART classifier with default parameters.
var trained = ee.Classifier.smileCart().train(training, label, bands);

// Classify the image with the same bands used for training.
var classified = image.select(bands).classify(trained);

// Display the inputs and the results.
Map.setCenter(-122.0877, 37.7880, 11);
Map.addLayer(image,
             {bands: ['SR_B4', 'SR_B3', 'SR_B2'], min: 0, max: 0.25},
             'image');
Map.addLayer(classified,
             {min: 0, max: 2, palette: ['orange', 'green', 'blue']},
             'classification');
// [END earthengine__classification01__image_classify]
