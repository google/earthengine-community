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

// [START earthengine__apidocs__ee_featurecollection_set]
// An empty FeatureCollection for simple demonstration.
var fc = ee.FeatureCollection([]);

// Set a single new property using a key-value pair.
fc = fc.set('key_1', 'value 1');

// Set multiple new properties using a series of key-value pairs.
fc = fc.set('key_2', 'value 2',
            'key_3', 3);

// Set new properties using a dictionary of key-value pairs.
fc = fc.set({
  key_5: ee.Array([1, 2, 3]),
  key_6: ee.Image(0),
  key_7: ee.Feature(null)
});
print('New FeatureCollection properties added', fc);

// Overwrite an existing property.
fc = fc.set('key_1', 'overwritten');
print('FeatureCollection property overwritten', fc);
// [END earthengine__apidocs__ee_featurecollection_set]
