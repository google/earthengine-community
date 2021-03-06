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

// [START earthengine__apidocs__ee_array_add]
var empty = ee.Array([], ee.PixelType.int8());
print(empty.add(empty));  // []

print(ee.Array([0]).add(1));  // [1]
print(ee.Array([1]).add([2]));  // [3]
print(ee.Array([-3]).add([-4]));  // [-7]

print(ee.Array([5, 6]).add([7, 8]));  // [12,14]

var array2x3 = ee.Array([[0, 1, 2], [3, 4, 5]]);
print(array2x3.add(1));  // [[1,2,3],[4,5,6]]
print(array2x3.add(array2x3));  // [[0,2,4],[6,8,10]]
// [END earthengine__apidocs__ee_array_add]
