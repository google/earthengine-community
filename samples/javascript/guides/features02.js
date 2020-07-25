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
 *   from 'Creating Features' page
 */

// [START earthengine__features02__feature_constructor]
// Create an ee.Geometry.
var polygon = ee.Geometry.Polygon([
  [[-35, -10], [35, -10], [35, 10], [-35, 10], [-35, -10]]
]);

// Create a Feature from the Geometry.
var polyFeature = ee.Feature(polygon, {foo: 42, bar: 'tart'});
// [END earthengine__features02__feature_constructor]

// [START earthengine__features02__inspect_feature]
print(polyFeature);
Map.addLayer(polyFeature, {}, 'feature');
// [END earthengine__features02__inspect_feature]

// [START earthengine__features02__null_feature]
// Create a dictionary of properties, some of which may be computed values.
var dict = {foo: ee.Number(8).add(88), bar: 'nihao'};

// Create a null geometry feature with the dictionary of properties.
var nowhereFeature = ee.Feature(null, dict);
// [END earthengine__features02__null_feature]
print(nowhereFeature);

// [START earthengine__features02__getting_setting]
// Make a feature and set some properties.
var feature = ee.Feature(ee.Geometry.Point([-122.22599, 37.17605]))
  .set('genus', 'Sequoia').set('species', 'sempervirens');

// Get a property from the feature.
var species = feature.get('species');
print(species);

// Set a new property.
feature = feature.set('presence', 1);

// Overwrite the old properties with a new dictionary.
var newDict = {genus: 'Brachyramphus', species: 'marmoratus'};
var feature = feature.set(newDict);

// Check the result.
print(feature);
// [END earthengine__features02__getting_setting]
