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

// [START earthengine__classification03__sample]
// Define a region of interest as a point.  Change the coordinates
// to get a classification of any place where there is imagery.
var roi = ee.Geometry.Point(-122.3942, 37.7295);

// Load Landsat 5 input imagery.
var landsat = ee.Image(ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA')
  // Filter to get only one year of images.
  .filterDate('2011-01-01', '2011-12-31')
  // Filter to get only images under the region of interest.
  .filterBounds(roi)
  // Sort by scene cloudiness, ascending.
  .sort('CLOUD_COVER')
  // Get the first (least cloudy) scene.
  .first());

// Compute cloud score.
var cloudScore = ee.Algorithms.Landsat.simpleCloudScore(landsat).select('cloud');

// Mask the input for clouds.  Compute the min of the input mask to mask
// pixels where any band is masked.  Combine that with the cloud mask.
var input = landsat.updateMask(landsat.mask().reduce('min').and(cloudScore.lte(50)));

// Use MODIS land cover, IGBP classification, for training.
var modis = ee.Image('MODIS/051/MCD12Q1/2011_01_01')
    .select('Land_Cover_Type_1');

// Sample the input imagery to get a FeatureCollection of training data.
var training = input.addBands(modis).sample({
  numPixels: 5000,
  seed: 0
});

// Make a Random Forest classifier and train it.
var classifier = ee.Classifier.smileRandomForest(10)
    .train({
      features: training,
      classProperty: 'Land_Cover_Type_1',
      inputProperties: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']
    });

// Classify the input imagery.
var classified = input.classify(classifier);

// Get a confusion matrix representing resubstitution accuracy.
var trainAccuracy = classifier.confusionMatrix();
print('Resubstitution error matrix: ', trainAccuracy);
print('Training overall accuracy: ', trainAccuracy.accuracy());

// Sample the input with a different random seed to get validation data.
var validation = input.addBands(modis).sample({
  numPixels: 5000,
  seed: 1
  // Filter the result to get rid of any null pixels.
}).filter(ee.Filter.neq('B1', null));

// Classify the validation data.
var validated = validation.classify(classifier);

// Get a confusion matrix representing expected accuracy.
var testAccuracy = validated.errorMatrix('Land_Cover_Type_1', 'classification');
print('Validation error matrix: ', testAccuracy);
print('Validation overall accuracy: ', testAccuracy.accuracy());

// Define a palette for the IGBP classification.
var igbpPalette = [
  'aec3d4', // water
  '152106', '225129', '369b47', '30eb5b', '387242', // forest
  '6a2325', 'c3aa69', 'b76031', 'd9903d', '91af40',  // shrub, grass
  '111149', // wetlands
  'cdb33b', // croplands
  'cc0013', // urban
  '33280d', // crop mosaic
  'd7cdcc', // snow and ice
  'f7e084', // barren
  '6f6f6f'  // tundra
];

// Display the input and the classification.
Map.centerObject(roi, 10);
Map.addLayer(input, {bands: ['B3', 'B2', 'B1'], max: 0.4}, 'landsat');
Map.addLayer(classified, {palette: igbpPalette, min: 0, max: 17}, 'classification');
// [END earthengine__classification03__sample]

// [START earthengine__classification03__one_sample]
var sample = input.addBands(modis).sample({
  numPixels: 5000,
  seed: 0
});

// The randomColumn() method will add a column of uniform random
// numbers in a column named 'random' by default.
sample = sample.randomColumn();

var split = 0.7;  // Roughly 70% training, 30% testing.
var training = sample.filter(ee.Filter.lt('random', split));
var validation = sample.filter(ee.Filter.gte('random', split));
// [END earthengine__classification03__one_sample]

// [START earthengine__classification03__spatial_autocorrelation]
// Sample the input imagery to get a FeatureCollection of training data.
var sample = input.addBands(modis).sample({
  region: landsat.geometry(),
  numPixels: 5000,
  seed: 0,
  geometries: true,
  tileScale: 16
});

// The randomColumn() method will add a column of uniform random
// numbers in a column named 'random' by default.
sample = sample.randomColumn();

var split = 0.7;  // Roughly 70% training, 30% testing.
var training = sample.filter(ee.Filter.lt('random', split));
print(training.size());
var validation = sample.filter(ee.Filter.gte('random', split));

// Spatial join.
var distFilter = ee.Filter.withinDistance({
  distance: 1000,
  leftField: '.geo',
  rightField: '.geo',
  maxError: 10
});

var join = ee.Join.inverted();

// Apply the join.
training = join.apply(training, validation, distFilter);
print(training.size());
// [END earthengine__classification03__spatial_autocorrelation]
