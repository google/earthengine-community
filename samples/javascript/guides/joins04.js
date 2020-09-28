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
 *   from 'Joins - Inner MODIS example' section
 */

// [START earthengine__joins04__modis_inner]
// Make a date filter to get images in this date range.
var dateFilter = ee.Filter.date('2014-01-01', '2014-02-01');

// Load a MODIS collection with EVI data.
var mcd43a4 = ee.ImageCollection('MODIS/MCD43A4_006_EVI')
    .filter(dateFilter);

// Load a MODIS collection with quality data.
var mcd43a2 = ee.ImageCollection('MODIS/006/MCD43A2')
    .filter(dateFilter);

// Define an inner join.
var innerJoin = ee.Join.inner();

// Specify an equals filter for image timestamps.
var filterTimeEq = ee.Filter.equals({
  leftField: 'system:time_start',
  rightField: 'system:time_start'
});

// Apply the join.
var innerJoinedMODIS = innerJoin.apply(mcd43a4, mcd43a2, filterTimeEq);

// Display the join result: a FeatureCollection.
print('Inner join output:', innerJoinedMODIS);
// [END earthengine__joins04__modis_inner]

// [START earthengine__joins04__inner_merge]
// Map a function to merge the results in the output FeatureCollection.
var joinedMODIS = innerJoinedMODIS.map(function(feature) {
  return ee.Image.cat(feature.get('primary'), feature.get('secondary'));
});

// Print the result of merging.
print('Inner join, merged bands:', joinedMODIS);
// [END earthengine__joins04__inner_merge]
