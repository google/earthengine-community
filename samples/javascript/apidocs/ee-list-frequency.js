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

// [START earthengine__apidocs__ee_list_frequency]
// An ee.Image list object.
var list = ee.List([0, 1, 2, 2, 3, 4]);
print('List of integers', list);

// The ee.List.frequency function is used to determine how many times a value is
// present in a list, e.g. what is the frequency of 0, 2, and 9 in the list.
print('Frequency of value 0', list.frequency(0));
print('Frequency of value 2', list.frequency(2));
print('Frequency of value 9', list.frequency(9));
// [END earthengine__apidocs__ee_list_frequency]
