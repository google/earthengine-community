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

// [START earthengine__apidocs__ee_number_divide]
print('5 / 10', ee.Number(5).divide(ee.Number(10)));  // 0.5
print('5 / 10.2', ee.Number(5).divide(ee.Number(10.2)));  // 0.490196078
print('5 / -10.2', ee.Number(5).divide(ee.Number(-10.2)));  // -0.490196078
print('-10.2 / 5', ee.Number(-10.2).divide(ee.Number(5)));  // -2.04
print('-10.2 / -5', ee.Number(-10.2).divide(ee.Number(-5)));  // 2.04
print('0 / 10', ee.Number(0).divide(ee.Number(10)));  // 0
print('10 / 0', ee.Number(10).divide(ee.Number(0)));  // 0
// [END earthengine__apidocs__ee_number_divide]
