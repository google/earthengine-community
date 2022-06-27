/**
 * Copyright 2021 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_classifier_amnhmaxent]
// Create some sample species presence/absence training data.
var trainingData = ee.FeatureCollection([
  // Species present points.
  ee.Feature(ee.Geometry.Point([-122.39567, 38.02740]), {presence: 1}),
  ee.Feature(ee.Geometry.Point([-122.68560, 37.83690]), {presence: 1}),
  // Species absent points.
  ee.Feature(ee.Geometry.Point([-122.59755, 37.92402]), {presence: 0}),
  ee.Feature(ee.Geometry.Point([-122.47137, 37.99291]), {presence: 0}),
  ee.Feature(ee.Geometry.Point([-122.52905, 37.85642]), {presence: 0}),
  ee.Feature(ee.Geometry.Point([-122.03010, 37.66660]), {presence: 0})
]);

// Import a Landsat 8 surface reflectance image.
var image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20200606')
                // Select the optical and thermal bands.
                .select(['.._B.*']);

// Sample the image at the location of the points.
var training = image.sampleRegions({collection: trainingData, scale: 30});

// Define and train a Maxent classifier from the image-sampled points.
var classifier = ee.Classifier.amnhMaxent().train({
  features: training,
  classProperty: 'presence',
  inputProperties: image.bandNames()
});

// Classify the image using the Maxent classifier.
var imageClassified = image.classify(classifier);

// Display the layers on the map.
// Species presence probability [0, 1] grades from black to white.
Map.centerObject(image, 9);
Map.addLayer(
    image.select(['SR_B4', 'SR_B3', 'SR_B2']).multiply(0.0000275).add(-0.2),
    {min: 0, max: 0.3}, 'Image');
Map.addLayer(
    imageClassified, {bands: 'probability', min: 0, max: 1}, 'Probability');
Map.addLayer(
    trainingData.filter('presence == 0'), {color: 'red'},
    'Training data (species absent)');
Map.addLayer(
    trainingData.filter('presence == 1'), {color: 'blue'},
    'Training data (species present)');
// [END earthengine__apidocs__ee_classifier_amnhmaxent]
