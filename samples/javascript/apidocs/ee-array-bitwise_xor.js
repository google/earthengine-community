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

// [START earthengine__apidocs__ee_array_bitwise_xor]
var empty = ee.Array([], ee.PixelType.int8());
print(empty.bitwise_xor(empty));  // []

print(ee.Array(0).bitwise_xor(ee.Array(0)));  // 0
print(ee.Array(0).bitwise_xor(ee.Array(1)));  // 1
print(ee.Array(1).bitwise_xor(ee.Array(0)));  // 1
print(ee.Array(1).bitwise_xor(ee.Array(1)));  // 0

print(ee.Array(0x00FF).bitwise_xor(ee.Array(0xFF00)));  // 65535

print(ee.Array([1, 2, 3]).bitwise_xor(ee.Array([5, 8, 16])));  // [4,10,19]
// [END earthengine__apidocs__ee_array_bitwise_xor]
