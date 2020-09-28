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
 *     from 'ui.Chart.image.series' section
 */

// [START earthengine__charts02__image_series]
// Load Landsat 8 top-of-atmosphere (TOA) input imagery.
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA').select('B[1-7]');

// Define a region of interest as a buffer around a point.
var geom = ee.Geometry.Point(-122.08384, 37.42503).buffer(500);

// Create and print the chart.
print(ui.Chart.image.series(collection, geom, ee.Reducer.mean(), 30));
// [END earthengine__charts02__image_series]
