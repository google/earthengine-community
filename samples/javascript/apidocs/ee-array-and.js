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

// [START earthengine__apidocs__ee_array_and]
// Element-wise boolean "and" operator.
// Both arrays must be the same dimensions.
var arrayNeither = ee.Array([0, 0]);
var arrayFirst = ee.Array([1, 0]);
var arraySecond = ee.Array([0, 1]);
var arrayBoth = ee.Array([1, 1]);
// Any non-zero value is true.
var arrayLarger = ee.Array([-2, 2]);

print(arrayBoth.and(arrayLarger));  // [1, 1]
print(arrayBoth.and(arrayNeither));  // [0, 0]

print(arrayFirst.and(arraySecond));  // [0, 0]
print(arraySecond.and(arrayFirst));  // [0, 0]

print(arrayBoth.and(arrayFirst));  // [1, 0]
print(arrayBoth.and(arraySecond));  // [0, 1]

print(arrayNeither.and(arrayFirst));  // [0, 0]
print(arrayNeither.and(arraySecond));  // [0, 0]

// Works the same for all PixelTypes.
var arrayDouble = ee.Array([0.0, 2.0], ee.PixelType.double());
print(arrayBoth.and(arrayDouble));  // [0, 1]
// [END earthengine__apidocs__ee_array_and]
