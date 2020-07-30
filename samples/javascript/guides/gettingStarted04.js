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
 *   from 'Finding ImageCollections and FeatureCollections' and
 *   'Filtering and Sorting' sections
 */

// [START earthengine__gettingStarted04__collection_load]
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1');
// [END earthengine__gettingStarted04__collection_load]

// [START earthengine__gettingStarted04__make_point]
var point = ee.Geometry.Point(-122.262, 37.8719);
// [END earthengine__gettingStarted04__make_point]


// [START earthengine__gettingStarted04__date_range]
var start = ee.Date('2014-06-01');
var finish = ee.Date('2014-10-01');
// [END earthengine__gettingStarted04__date_range]


// [START earthengine__gettingStarted04__filter_ic]
var filteredCollection = ee.ImageCollection('LANDSAT/LC08/C01/T1')
  .filterBounds(point)
  .filterDate(start, finish)
  .sort('CLOUD_COVER', true);
// [END earthengine__gettingStarted04__filter_ic]

// [START earthengine__gettingStarted04__get_first]
var first = filteredCollection.first();
// [END earthengine__gettingStarted04__get_first]

// [START earthengine__gettingStarted04__filter_fc]
// Load a feature collection.
var featureCollection = ee.FeatureCollection('TIGER/2016/States');

// Filter the collection.
var filteredFC = featureCollection.filter(ee.Filter.eq('NAME', 'California'));

// Display the collection.
Map.addLayer(filteredFC, {}, 'California');
// [END earthengine__gettingStarted04__filter_fc]
