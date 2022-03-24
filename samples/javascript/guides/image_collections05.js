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
 *   from 'Reducing' page
 */

// [START earthengine__image_collections05__median]
// Load a Landsat 8 collection for a single path-row.
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filter(ee.Filter.eq('WRS_PATH', 44))
    .filter(ee.Filter.eq('WRS_ROW', 34))
    .filterDate('2014-01-01', '2015-01-01');

// Compute a median image and display.
var median = collection.median();
Map.setCenter(-122.3578, 37.7726, 12);
Map.addLayer(median, {bands: ['B4', 'B3', 'B2'], max: 0.3}, 'Median');
// [END earthengine__image_collections05__median]

// [START earthengine__image_collections05__alt_median]
// Reduce the collection with a median reducer.
var median = collection.reduce(ee.Reducer.median());

// Display the median image.
Map.addLayer(median,
             {bands: ['B4_median', 'B3_median', 'B2_median'], max: 0.3},
             'Also median');
// [END earthengine__image_collections05__alt_median]

// [START earthengine__image_collections05__short_median]
// Reduce the collection with a median reducer.
var median = collection.reduce('median');

// Display the median image.
Map.addLayer(median,
             {bands: ['B4_median', 'B3_median', 'B2_median'], max: 0.3},
             'Yet another median');
// [END earthengine__image_collections05__short_median]

