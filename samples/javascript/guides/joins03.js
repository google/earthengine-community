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
 *   from 'Joins - Inner toy example' section
 */

// [START earthengine__joins03__toy_inner]
// Create the primary collection.
var primaryFeatures = ee.FeatureCollection([
  ee.Feature(null, {foo: 0, label: 'a'}),
  ee.Feature(null, {foo: 1, label: 'b'}),
  ee.Feature(null, {foo: 1, label: 'c'}),
  ee.Feature(null, {foo: 2, label: 'd'}),
]);

// Create the secondary collection.
var secondaryFeatures = ee.FeatureCollection([
  ee.Feature(null, {bar: 1, label: 'e'}),
  ee.Feature(null, {bar: 1, label: 'f'}),
  ee.Feature(null, {bar: 2, label: 'g'}),
  ee.Feature(null, {bar: 3, label: 'h'}),
]);

// Use an equals filter to specify how the collections match.
var toyFilter = ee.Filter.equals({
  leftField: 'foo',
  rightField: 'bar'
});

// Define the join.
var innerJoin = ee.Join.inner('primary', 'secondary');

// Apply the join.
var toyJoin = innerJoin.apply(primaryFeatures, secondaryFeatures, toyFilter);

// Print the result.
print('Inner join toy example:', toyJoin);
// [END earthengine__joins03__toy_inner]
