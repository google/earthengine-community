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
// Define a region of interest.
var roi = ee.Geometry.BBox(-122.93, 36.99, -121.20, 38.16);

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
var input = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterBounds(roi)
    .filterDate('2020-03-01', '2020-07-01')
    .map(prepSrL8)
    .median()
    .setDefaultProjection('EPSG:4326', null, 30)
    .select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7']);

// Use MODIS land cover, IGBP classification, for training.
var modis = ee.Image('MODIS/006/MCD12Q1/2020_01_01')
    .select('LC_Type1');

// Sample the input imagery to get a FeatureCollection of training data.
var training = input.addBands(modis).sample({
  region: roi,
  numPixels: 5000,
  seed: 0
});

// Make a Random Forest classifier and train it.
var classifier = ee.Classifier.smileRandomForest(10)
    .train({
      features: training,
      classProperty: 'LC_Type1',
      inputProperties: ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7']
    });

// Classify the input imagery.
var classified = input.classify(classifier);

// Get a confusion matrix representing resubstitution accuracy.
var trainAccuracy = classifier.confusionMatrix();
print('Resubstitution error matrix: ', trainAccuracy);
print('Training overall accuracy: ', trainAccuracy.accuracy());

// Sample the input with a different random seed to get validation data.
var validation = input.addBands(modis).sample({
  region: roi,
  numPixels: 5000,
  seed: 1
  // Filter the result to get rid of any null pixels.
}).filter(ee.Filter.notNull(input.bandNames()));

// Classify the validation data.
var validated = validation.classify(classifier);

// Get a confusion matrix representing expected accuracy.
var testAccuracy = validated.errorMatrix('LC_Type1', 'classification');
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
Map.addLayer(input.clip(roi),
             {bands: ['SR_B4', 'SR_B3', 'SR_B2'], min: 0, max: 0.25},
             'landsat');
Map.addLayer(classified.clip(roi),
             {palette: igbpPalette, min: 0, max: 17},
             'classification');
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
  region: roi,
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
