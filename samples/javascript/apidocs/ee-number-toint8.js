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

// [START earthengine__apidocs__ee_number_toint8]
// Values less than the minimum allowed signed 8-bit integer clamp to the
// minimum value.
print(ee.Number(-1e21).toInt8());  // -128
print(ee.Number(-129).toInt8());  // -128
print(ee.Number(-128).toInt8());  // -128
print(ee.Number(-127).toInt8());  // -127

// Rounds towards zero.
print(ee.Number(-1.1).toInt8());  // -1
print(ee.Number(-1).toInt8());  // -1
print(ee.Number(-0.9).toInt8());  // 0
print(ee.Number(-0.1).toInt8());  // 0
print(ee.Number(0).toInt8());  // 0
print(ee.Number(0.1).toInt8());  // 0
print(ee.Number(0.9).toInt8());  // 0
print(ee.Number(1).toInt8());  // 1
print(ee.Number(1.1).toInt8());  // 1

// Values greeater than the maximum allowed signed 8-bit integer clamp to the
// maximum value.
print(ee.Number(127).toInt8());  // 127
print(ee.Number(128).toInt8());  // 127
// [END earthengine__apidocs__ee_number_toint8]
