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
// Load Landsat 8 data, filter by date, month, and bounds.
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterDate('2015-01-01', '2018-01-01')  // Three years of data
  .filter(ee.Filter.calendarRange(11, 2, 'month'))  // Only Nov-Feb observations
  .filterBounds(ee.Geometry.Point(25.8544, -18.08874));  // Intersecting ROI

// Also filter the collection by the CLOUD_COVER property.
var filtered = collection.filter(ee.Filter.eq('CLOUD_COVER', 0));

// Create two composites to check the effect of filtering by CLOUD_COVER.
var badComposite = collection.mean();
var goodComposite = filtered.mean();

// Display the composites.
Map.setCenter(25.8544, -18.08874, 13);
Map.addLayer(badComposite,
             {bands: ['B3', 'B2', 'B1'], min: 0.05, max: 0.35, gamma: 1.1},
             'Bad composite');
Map.addLayer(goodComposite,
             {bands: ['B3', 'B2', 'B1'], min: 0.05, max: 0.35, gamma: 1.1},
             'Good composite');
// [END earthengine__image_collections03__filtering]
