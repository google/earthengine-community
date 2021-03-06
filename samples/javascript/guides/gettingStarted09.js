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
 *   from 'Reducing' section
 */

// [START earthengine__gettingStarted09__temporal_reduce]
// Load a Landsat 8 collection.
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1')
  // Filter by date and location.
  .filterBounds(ee.Geometry.Point(-122.262, 37.8719))
  .filterDate('2014-01-01', '2014-12-31')
  // Sort by increasing cloudiness.
  .sort('CLOUD_COVER');

// Compute the median of each pixel for each band of the 5 least cloudy scenes.
var median = collection.limit(5).reduce(ee.Reducer.median());
// [END earthengine__gettingStarted09__temporal_reduce]

// Define an object of visualization parameters to control how the image is rendered.
var vizParams = {
  bands: ['B5_median', 'B4_median', 'B3_median'], min: 5000, max: 15000
};

// Display the image using the predefined visualization parameters.
Map.addLayer(median, vizParams, 'median false color');
