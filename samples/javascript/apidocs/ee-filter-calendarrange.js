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

// [START earthengine__apidocs__ee_filter_calendarrange]
// A Sentinel-2 surface reflectance image collection intersecting the peak of
// Mount Shasta, California, USA.
var ic = ee.ImageCollection('COPERNICUS/S2_SR')
             .filterBounds(ee.Geometry.Point(-122.196, 41.411));

print('Images for a month range (June-August)',
      ic.filter(ee.Filter.calendarRange(6, 8, 'month')));

print('A start value greater than end value is valid (Dec-Feb)',
      ic.filter(ee.Filter.calendarRange(12, 2, 'month')));

// This example uses the 'year' field value. Note that ee.Filter.date is the
// preferred method when filtering by whole years, as it is much faster.
print('Images for a year range (2020-2021)',
      ic.filter(ee.Filter.calendarRange(2020, 2021, 'year')));

// This example uses the 'day_of_year' field value. Note that
// ee.Filter.dayOfYear is the preferred method for filtering by DOY.
// The ee.Date.getRelative function is used to identify DOY from an ee.Date
// object for a representative year. Be mindful of leap years when filtering
// by DOY.
var startDoy = ee.Date('2000-06-01').getRelative('day', 'year');
var endDoy = ee.Date('2000-06-15').getRelative('day', 'year');
print('start DOY =', startDoy,
      'end DOY =', endDoy,
      'Images for a day-of-year range',
      ic.filter(ee.Filter.calendarRange(startDoy, endDoy, 'day_of_year')));
// [END earthengine__apidocs__ee_filter_calendarrange]
