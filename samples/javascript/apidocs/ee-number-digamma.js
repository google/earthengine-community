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

// [START earthengine__apidocs__ee_number_digamma]
print('Digamma for -1.5', ee.Number(-1.5).digamma());  // 0.703156637
print('Digamma for -1', ee.Number(-1).digamma());  // -Infinity
print('Digamma for 0', ee.Number(0).digamma());  // -Infinity
print('Digamma for 0.5', ee.Number(0.5).digamma());  // -1.963510028
print('Digamma for 1', ee.Number(1).digamma());  // -0.577215667
print('Digamma for 100', ee.Number(100).digamma());  // 4.600161852
print('Digamma for 1e13', ee.Number(1e13).digamma());  // 29.933606208
// [END earthengine__apidocs__ee_number_digamma]
