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

// [START earthengine__apidocs__ee_dictionary_fromlists]
// Corresponding lists of keys and values.
var keys = ['B1', 'B2', 'B3'];
var values = [182, 219, 443];
print('Dictionary from lists of keys and values',
      ee.Dictionary.fromLists(keys, values));
// [END earthengine__apidocs__ee_dictionary_fromlists]
