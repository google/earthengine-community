/**
 * Copyright 2022 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_imagecollection_filterdate]
// A Landsat 8 TOA image collection intersecting a specific point.
var col = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(ee.Geometry.Point(-90.70, 34.71));

// Filter the collection by date using date strings.
print('2020 images', col.filterDate('2020', '2021'));
print('July images, 2020', col.filterDate('2020-07', '2020-08'));
print('Early July images, 2020', col.filterDate('2020-07-01', '2020-07-10'));
print('Include time (13 hours, July 7, 2020)',
      col.filterDate('2020-07-05T06:34:46', '2020-07-05T19:34:46'));

// Use milliseconds since Unix epoch.
print('Milliseconds inputs', col.filterDate(1593967014062, 1595349419611));

// Use ee.Date objects.
print('ee.Date inputs', col.filterDate(ee.Date('2020'), ee.Date('2021')));

// Use an ee.DateRange object.
var dateRange = ee.DateRange('2020-07-01', '2020-07-10');
print('ee.DateRange input', col.filterDate(dateRange));
// [END earthengine__apidocs__ee_imagecollection_filterdate]
