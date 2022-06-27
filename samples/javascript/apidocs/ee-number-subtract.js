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

// [START earthengine__apidocs__ee_number_subtract]
print('5 - 10', ee.Number(5).subtract(ee.Number(10)));  // -5
print('10 - 5', ee.Number(10).subtract(ee.Number(5)));  // 5
print('5 - 10.2', ee.Number(5).subtract(ee.Number(10.2)));  // -5.199999999
print('5 - -10.2', ee.Number(5).subtract(ee.Number(-10.2)));  // 15.2
// [END earthengine__apidocs__ee_number_subtract]
