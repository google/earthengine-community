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

// [START earthengine__apidocs__ee_number_erfc]
print('Complementary error function of -10',
      ee.Number(-10).erfc());  // 2

print('Complementary error function of -0.001',
      ee.Number(-0.001).erfc());  // 1.001128378

print('Complementary error function of 0',
      ee.Number(0).erfc());  // 1

print('Complementary error function of 0.001',
      ee.Number(0.001).erfc());  // 0.998871621

print('Complementary error function of 10',
      ee.Number(10).erfc());  // 2.088487583e-45
// [END earthengine__apidocs__ee_number_erfc]
