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
 *   from 'Joins - Save Best' section
 */

// [START earthengine__joins06__save_best]
// Load a primary collection: Landsat imagery.
var primary = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterDate('2014-04-01', '2014-06-01')
    .filterBounds(ee.Geometry.Point(-122.092, 37.42));

// Load a secondary collection: GRIDMET meteorological data
var gridmet = ee.ImageCollection('IDAHO_EPSCOR/GRIDMET');

// Define a max difference filter to compare timestamps.
var maxDiffFilter = ee.Filter.maxDifference({
  difference: 2 * 24 * 60 * 60 * 1000,
  leftField: 'system:time_start',
  rightField: 'system:time_start'
});

// Define the join.
var saveBestJoin = ee.Join.saveBest({
  matchKey: 'bestImage',
  measureKey: 'timeDiff'
});

// Apply the join.
var landsatMet = saveBestJoin.apply(primary, gridmet, maxDiffFilter);

// Print the result.
print(landsatMet);
// [END earthengine__joins06__save_best]

// check the dates (both UTC)
var firstLeftMatch = ee.Image(landsatMet.first());
var firstRightMatch = ee.Image(firstLeftMatch.get('bestImage'));
print(ee.Date(firstLeftMatch.get('system:time_start')));
print(ee.Date(firstRightMatch.get('system:time_start')));
