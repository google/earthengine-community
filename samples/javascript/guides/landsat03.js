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
 *   from 'Landsat Algorithms - Simple Composite' section
 */

// [START earthengine__landsat03__simple_composite]
// Load a raw Landsat 5 ImageCollection for a single year.
var collection = ee.ImageCollection('LANDSAT/LT05/C01/T1')
    .filterDate('2010-01-01', '2010-12-31');

// Create a cloud-free composite with default parameters.
var composite = ee.Algorithms.Landsat.simpleComposite(collection);

// Create a cloud-free composite with custom parameters for
// cloud score threshold and percentile.
var customComposite = ee.Algorithms.Landsat.simpleComposite({
  collection: collection,
  percentile: 75,
  cloudScoreRange: 5
});

// Display the composites.
Map.setCenter(-122.3578, 37.7726, 10);
Map.addLayer(composite, {bands: ['B4', 'B3', 'B2'], max: 128}, 'TOA composite');
Map.addLayer(customComposite, {bands: ['B4', 'B3', 'B2'], max: 128},
    'Custom TOA composite');
// [END earthengine__landsat03__simple_composite]
