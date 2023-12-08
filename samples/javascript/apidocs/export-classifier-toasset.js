/**
 * Copyright 2023 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START earthengine__apidocs__export_classifier_toasset]
// First gather the training data for a random forest classifier.
// Let's use MCD12Q1 yearly landcover for the labels.
var landcover = ee.ImageCollection('MODIS/061/MCD12Q1')
    .filterDate('2022-01-01', '2022-12-31')
    .first()
    .select('LC_Type1');
// A region of interest for training our classifier.
var region = ee.Geometry.BBox(17.33, 36.07, 26.13, 43.28);

// Training features will be based on a Landsat 8 composite.
var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1')
  .filterBounds(region)
    .filterDate('2022-01-01', '2023-01-01');

// Draw the Landsat composite, visualizing true color bands.
var landsatComposite = ee.Algorithms.Landsat.simpleComposite({
  collection: l8,
  asFloat: true
});
Map.addLayer(landsatComposite, {
  min: 0,
  max: 0.3,
  bands: ['B3', 'B2', 'B1']
}, 'Landsat composite');

// Make a training dataset by sampling the stacked images.
var training = landcover.addBands(landsatComposite).sample({
  region: region,
  scale: 30,
  // With export to Classifier we can bump this higher to say 10,000.
  numPixels: 1000
});

var classifier = ee.Classifier.smileRandomForest({
  // We can also increase the number of trees higher to ~100 if needed.
  numberOfTrees: 3
}).train({features: training, classProperty: 'LC_Type1'});

// Create an export classifier task to run.
var assetId = 'projects/<project-name>/assets/<asset-name>';  // <> modify these
Export.classifier.toAsset({
  classifier: classifier,
  description: 'classifier_export',
  assetId: assetId
});

// Load the classifier after the export finishes and visualize.
var savedClassifier = ee.Classifier.load(assetId)
var landcoverPalette = '05450a,086a10,54a708,78d203,009900,c6b044,dcd159,' +
  'dade48,fbff13,b6ff05,27ff87,c24f44,a5a5a5,ff6d4c,69fff8,f9ffa4,1c0dff';
var landcoverVisualization = {
  palette: landcoverPalette,
  min: 0,
  max: 16,
  format: 'png'
};
Map.addLayer(
    landsatComposite.classify(savedClassifier),
    landcoverVisualization,
    'Upsampled landcover, saved');
// [END earthengine__apidocs__export_image_toasset]
