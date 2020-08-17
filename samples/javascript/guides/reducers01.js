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
 *   from 'Reducers - ImageCollection reduce' section
 */

// [START earthengine__reducers01__ic_median]
// Load an image collection, filtered so it's not too much data.
var collection = ee.ImageCollection('LANDSAT/LT05/C01/T1')
  .filterDate('2008-01-01', '2008-12-31')
  .filter(ee.Filter.eq('WRS_PATH', 44))
  .filter(ee.Filter.eq('WRS_ROW', 34));

// Compute the median in each band, each pixel.
// Band names are B1_median, B2_median, etc.
var median = collection.reduce(ee.Reducer.median());

// The output is an Image.  Add it to the map.
var vis_param = {bands: ['B4_median', 'B3_median', 'B2_median'], gamma: 1.6};
Map.setCenter(-122.3355, 37.7924, 9);
Map.addLayer(median, vis_param);
// [END earthengine__reducers01__ic_median]
