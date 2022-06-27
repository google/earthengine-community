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

// [START earthengine__apidocs__ee_pixeltype]
print(ee.PixelType('int', 0, 1));  // int ∈ [0, 1]
print(ee.PixelType('int', -20, -10));  // int ∈ [-20, -10]
print(ee.PixelType('float'));  // float
print(ee.PixelType('double'));  // double
print(ee.PixelType('double', null));  // double
print(ee.PixelType('double', null, null));  // double
print(ee.PixelType('double', null, null, 0));  // double
print(ee.PixelType('double', null, null, 1));  // double, 1 dimensions
print(ee.PixelType('double', null, null, 2));  // double, 2 dimensions
print(ee.PixelType('double', null, null, 3));  // double, 3 dimensions
print(ee.PixelType('double', null, null, 10));  // double, 10 dimensions
print(ee.PixelType('double', null, null, 1e8));  // double, 100000000 dimensions

print(ee.PixelType('double', 1, 2, 0));  // double ∈ [1, 2]
print(ee.PixelType('double', 1, 3, 2));  // double ∈ [1, 3], 2 dimensions
print(ee.PixelType('double', -4, -3, 0));  // double ∈ [-4, -3]

print(ee.PixelType('double', null, 2.3, 0));  // double
print(ee.PixelType('double', 3.4, null, 0));  // double
// [END earthengine__apidocs__ee_pixeltype]
