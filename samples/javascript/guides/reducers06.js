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
 *   from 'Reducers - FeatureCollection.reduceColumns' section
 */

// [START earthengine__reducers06__toy_reduce_columns]
// Make a toy FeatureCollection.
var aFeatureCollection = ee.FeatureCollection([
  ee.Feature(null, {foo: 1, weight: 1}),
  ee.Feature(null, {foo: 2, weight: 2}),
  ee.Feature(null, {foo: 3, weight: 3}),
]);

// Compute a weighted mean and display it.
print(aFeatureCollection.reduceColumns({
  reducer: ee.Reducer.mean(),
  selectors: ['foo'],
  weightSelectors: ['weight']
}));
// [END earthengine__reducers06__toy_reduce_columns]
