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
 *   from 'Reducers - FeatureCollection.reduceToImage' section
 */

// [START earthengine__reducers08__reduce_to_image]
// Load a collection of US counties.
var counties = ee.FeatureCollection('TIGER/2018/Counties');

// Make an image out of the land area attribute.
var landAreaImg = counties
  .filter(ee.Filter.notNull(['ALAND']))
  .reduceToImage({
    properties: ['ALAND'],
    reducer: ee.Reducer.first()
});

// Display the county land area image.
Map.setCenter(-99.976, 40.38, 5);
Map.addLayer(landAreaImg, {
  min: 3e8,
  max: 1.5e10,
  palette: ['FCFDBF', 'FDAE78', 'EE605E', 'B63679', '711F81', '2C105C']
});
// [END earthengine__reducers08__reduce_to_image]
