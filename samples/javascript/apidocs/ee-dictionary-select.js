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

// [START earthengine__apidocs__ee_dictionary_select]
// A dictionary (e.g. results of ee.Image.reduceRegion of an S2 image).
var dict = ee.Dictionary({
  B1: 182,
  B2: 219,
  B3: 443
});

print('Select keys by name', dict.select(['B1', 'B2']));
print('Select keys by regex', dict.select(['B[1-2]']));
print('Set ignoreMissing as true to avoid an unmatched key error',
      dict.select({selectors: ['B1', 'B2', 'Region'], ignoreMissing: true}));
// [END earthengine__apidocs__ee_dictionary_select]
