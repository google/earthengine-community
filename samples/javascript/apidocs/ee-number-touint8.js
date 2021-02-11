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

// [START earthengine__apidocs__ee_number_touint8]
// Clamps to zero for negative values.
print(ee.Number(-1).toUint8());  // 0
print(ee.Number(-0.9).toUint8());  // 0
print(ee.Number(-0.1).toUint8());  // 0
print(ee.Number(0).toUint8());  // 0
// Rounds down.
print(ee.Number(0.1).toUint8());  // 0
print(ee.Number(0.9).toUint8());  // 0
print(ee.Number(1).toUint8());  // 1
// Clamps at 255 for large positive values.
print(ee.Number(255).toUint8());  // 255
print(ee.Number(256).toUint8());  // 255
// [END earthengine__apidocs__ee_number_touint8]
