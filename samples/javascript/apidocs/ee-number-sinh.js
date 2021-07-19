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

// [START earthengine__apidocs__ee_number_sinh]
// Input angle in radians.
print('Hyperbolic sine of -5', ee.Number(-5).sinh());  // -74.203210577
print('Hyperbolic sine of -1', ee.Number(-1).sinh());  // -1.175201193
print('Hyperbolic sine of 0', ee.Number(0).sinh());  // 0
print('Hyperbolic sine of 1', ee.Number(1).sinh());  // 1.175201193
print('Hyperbolic sine of 5', ee.Number(5).sinh());  // 74.203210577

// Convert degrees to radians.
var degrees = 45;
var radians = degrees * (Math.PI/180);
print('Hyperbolic sine of 45 degrees',
      ee.Number(radians).sinh());  // 0.868670961
// [END earthengine__apidocs__ee_number_sinh]
