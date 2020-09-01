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
 *   from 'Filtering Image Collections' page
 */

// [START earthengine__image_collections03__filtering]
// Load Landsat 5 data, filter by date and bounds.
var collection = ee.ImageCollection('LANDSAT/LT05/C01/T2')
  .filterDate('1987-01-01', '1990-05-01')
  .filterBounds(ee.Geometry.Point(25.8544, -18.08874));

// Also filter the collection by the IMAGE_QUALITY property.
var filtered = collection
  .filterMetadata('IMAGE_QUALITY', 'equals', 9);

// Create two composites to check the effect of filtering by IMAGE_QUALITY.
var badComposite = ee.Algorithms.Landsat.simpleComposite(collection, 75, 3);
var goodComposite = ee.Algorithms.Landsat.simpleComposite(filtered, 75, 3);

// Display the composites.
Map.setCenter(25.8544, -18.08874, 13);
Map.addLayer(badComposite,
             {bands: ['B3', 'B2', 'B1'], gain: 3.5},
             'bad composite');
Map.addLayer(goodComposite,
             {bands: ['B3', 'B2', 'B1'], gain: 3.5},
             'good composite');
// [END earthengine__image_collections03__filtering]
