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

// [START earthengine__apidocs__ee_number_exp]
print('e^-1', ee.Number(-1).exp());  // 0.367879441
print('e^0', ee.Number(0).exp());  // 1
print('e^1', ee.Number(1).exp());  // 2.718281828
print('e^2', ee.Number(2).exp());  // 7.389056098
// [END earthengine__apidocs__ee_number_exp]
