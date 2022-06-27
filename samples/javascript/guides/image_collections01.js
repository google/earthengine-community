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
 *   from 'Image Collections - Information and Metadata' page
 */

// [START earthengine__image_collections01__collection_info]
// Load a Landsat 8 ImageCollection for a single path-row.
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filter(ee.Filter.eq('WRS_PATH', 44))
    .filter(ee.Filter.eq('WRS_ROW', 34))
    .filterDate('2014-03-01', '2014-08-01');
print('Collection: ', collection);

// Get the number of images.
var count = collection.size();
print('Count: ', count);

// Get the date range of images in the collection.
var range = collection.reduceColumns(ee.Reducer.minMax(), ['system:time_start'])
print('Date range: ', ee.Date(range.get('min')), ee.Date(range.get('max')))

// Get statistics for a property of the images in the collection.
var sunStats = collection.aggregate_stats('SUN_ELEVATION');
print('Sun elevation statistics: ', sunStats);

// Sort by a cloud cover property, get the least cloudy image.
var image = ee.Image(collection.sort('CLOUD_COVER').first());
print('Least cloudy image: ', image);

// Limit the collection to the 10 most recent images.
var recent = collection.sort('system:time_start', false).limit(10);
print('Recent images: ', recent);
// [END earthengine__image_collections01__collection_info]
