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

// [START earthengine__apidocs__ee_array_cut]
print(ee.Array([9]).cut([0]));  // [9]
print(ee.Array([9]).cut([-1]));  // [9]

var array1x3 = ee.Array([0, 1, 2]);
print(array1x3.cut([-1]));  // [0,1,2]
print(array1x3.cut([0]));  // [0]
print(array1x3.cut([2]));  // [2]

var array2x3 = ee.Array([[0, 1, 2], [3, 4, 5]]);
print(array2x3.cut([-1, -1]));  // [[0,1,2],[3,4,5]]
print(array2x3.cut([-1, 0]));  // [[0],[3]]
print(array2x3.cut([1, -1]));  // [[3,4,5]]
// [END earthengine__apidocs__ee_array_cut]
