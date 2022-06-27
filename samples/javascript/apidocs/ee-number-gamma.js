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

// [START earthengine__apidocs__ee_number_gamma]
// Values less than or equal to 0 are invalid.
print('Gamma for 0.001', ee.Number(0.001).gamma());  // 999.423772484
print('Gamma for 0.5', ee.Number(0.5).gamma());  // 1.772453850
print('Gamma for 1', ee.Number(1).gamma());  // 1
print('Gamma for 100', ee.Number(100).gamma());  // 9.332621544e+155
print('Gamma for 200', ee.Number(200).gamma());  // Infinity
// [END earthengine__apidocs__ee_number_gamma]
