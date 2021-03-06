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

// [START earthengine__apidocs__ee_list_sequence]
print(ee.List.sequence(0, 5));  // [0,1,2,3,4,5]
print(ee.List.sequence(0, 10, 2));  // [0,2,4,6,8,10]
print(ee.List.sequence(0, null, 2, 6));  // [0,2,4,6,8,10]
print(ee.List.sequence(0, null, -2, 6));  // [0,-2,-4,-6,-8,-10]

// Step ignored when present along with count.
print(ee.List.sequence(0, 10, 2, 999));  // 999 elements
print(ee.List.sequence(0, 10, 2, 3));  // [0,5,10]

// Using a dictionary for arguments.
print(ee.List.sequence({start:10, count:3}));  // [10,11,12]
print(ee.List.sequence({start:3, step:2, end:6}));  // [3,5]
// [-1000000000,0,1000000000]
print(ee.List.sequence({start:-1e9, end:1e9, count:3}));
// [END earthengine__apidocs__ee_list_sequence]
