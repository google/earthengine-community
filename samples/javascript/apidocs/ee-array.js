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

// [START earthengine__apidocs__ee_array]
// Requires an explicit PixelType if no data.
print(ee.Array([], ee.PixelType.int8()));  // Empty []
print(ee.Array([[]], ee.PixelType.uint8()));  // Empty [[]]
print(ee.Array([[], []], ee.PixelType.float()));  // Empty [[], []]

// 1-D Arrays
print(ee.Array([0]));  // [0]
print(ee.Array([0, 1]));  // [0, 1]
// 2-D Arrays
print(ee.Array([[1]]));  // [[1]]
print(ee.Array([[0, 1], [2, 3]]));  // [[0,1],[2,3]]

// Arrays from ee.Number.
print(ee.Array([ee.Number(123).toUint8()]));  // [123]

// Lists are useful ways to construct larger Arrays.
print(ee.Array(ee.List.sequence(0, 10, 2)));  // // [0,2,4,6,8,10]

// Arrays can be used to make Arrays.
var array1D = ee.Array([1, 2, 3]);
// This is a cast.
print(ee.Array(array1D));  // [1,2,3]
// [END earthengine__apidocs__ee_array]
