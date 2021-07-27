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

// [START earthengine__apidocs__ee_number_gammainc]
print('Lower incomplete gamma function for x = 0, a = 1',
      ee.Number(0).gammainc(1));  // 0

print('Lower incomplete gamma function for x = 1, a = 1',
      ee.Number(1).gammainc(1));  // 0.632120558

print('Lower incomplete gamma function for x = 10, a = 1',
      ee.Number(10).gammainc(1));  // 0.999954600

print('Lower incomplete gamma function for x = -1, a = 1',
      ee.Number(-1).gammainc(1));  // NaN

print('Lower incomplete gamma function for x = 10, a = -1',
      ee.Number(10).gammainc(-1));  // NaN
// [END earthengine__apidocs__ee_number_gammainc]
