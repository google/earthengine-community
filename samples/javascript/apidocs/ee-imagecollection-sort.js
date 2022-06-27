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

// [START earthengine__apidocs__ee_imagecollection_sort]
// A Landsat 8 TOA image collection (2 months of images at a specific point).
var col = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(ee.Geometry.Point(-90.70, 34.71))
  .filterDate('2020-07-01', '2020-09-01');
print('Collection', col);

// Sort the collection in ASCENDING order of image cloud cover.
var colCldSortAsc = col.sort('CLOUD_COVER');
print('Cloud cover ascending', colCldSortAsc);

// Display the image with the least cloud cover.
var visParams = {
  bands: ['B4', 'B3', 'B2'],
  min: 0.01,
  max: 0.25
};
Map.setCenter(-90.70, 34.71, 9);
Map.addLayer(colCldSortAsc.first(), visParams, 'Least cloudy');

// Sort the collection in DESCENDING order of image cloud cover.
var colCldSortDesc = col.sort('CLOUD_COVER', false);
print('Cloud cover descending', colCldSortDesc);

// Display the image with the most cloud cover.
Map.addLayer(colCldSortDesc.first(), visParams, 'Most cloudy');
// [END earthengine__apidocs__ee_imagecollection_sort]
