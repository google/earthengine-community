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

// [START earthengine__apidocs__ee_imagecollection_getstring]
// A contrived, empty image collection for simple demonstration.
var col = ee.ImageCollection([]);
print('Collection without properties', col);

// Set collection properties using a dictionary.
col = col.set({
  project_name: 'biomass_tracking',
  project_id: 3,
  plot_ids: ee.Array([7, 11, 20])
});

// Set collection properties using a series of key-value pairs.
col = col.set('project_year', 2018,
              'rgb_vis', 'false_color');

print('Collection with properties', col);

// Get a dictionary of collection property keys and values.
print('Property keys and values (ee.Dictionary)', col.toDictionary());

// Get the value of a collection property. To use the result of
// ee.ImageCollection.get in further computation, you need to cast it to the
// appropriate class, for example, ee.Number(result) or ee.String(result).
print('Project ID (ambiguous object)', col.get('project_id'));

// Get the value of a string collection property as an ee.String object.
print('Project name (ee.String)', col.getString('project_name'));

// Get the value of a numeric collection property as an ee.Number object.
print('Project year (ee.Number)', col.getNumber('project_year'));

// Get the value of an ee.Array collection property as an ee.Array object.
print('Plot IDs (ee.Array)', col.getArray('plot_ids'));
// [END earthengine__apidocs__ee_imagecollection_getstring]
