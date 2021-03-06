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
 *   from 'Unsupervised Classification' section
 */

// [START earthengine__clustering__clustering]
// Load a pre-computed Landsat composite for input.
var input = ee.Image('LANDSAT/LE7_TOA_1YEAR/2001');

// Define a region in which to generate a sample of the input.
var region = ee.Geometry.Rectangle(29.7, 30, 32.5, 31.7);

// Display the sample region.
Map.setCenter(31.5, 31.0, 8);
Map.addLayer(ee.Image().paint(region, 0, 2), {}, 'region');

// Make the training dataset.
var training = input.sample({
  region: region,
  scale: 30,
  numPixels: 5000
});

// Instantiate the clusterer and train it.
var clusterer = ee.Clusterer.wekaKMeans(15).train(training);

// Cluster the input using the trained clusterer.
var result = input.cluster(clusterer);

// Display the clusters with random colors.
Map.addLayer(result.randomVisualizer(), {}, 'clusters');
// [END earthengine__clustering__clustering]
