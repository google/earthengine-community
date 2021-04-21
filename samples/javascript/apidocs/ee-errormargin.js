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

// [START earthengine__apidocs__ee_errormargin]
// Construct a variety of error margins.
print(ee.ErrorMargin(0));  // unit: meters value: 0
print(ee.ErrorMargin(1));  // unit: meters value: 1
// Negative margin yields a positive value.
print(ee.ErrorMargin(-1));  // unit: meters value: 1
// Large values are turned into an 'infinite'
print(ee.ErrorMargin(1e8));  // unit: infinite
// A very large error margin does not quite trigger infinite, which is 2.0e7.
print(ee.ErrorMargin(1e7));  // unit: meters value: 10000000

// Being explicit about the units of the error margin.
print(ee.ErrorMargin(1, 'meters'));  // unit: meters value: 1
print(ee.ErrorMargin(1, 'projected'));  // unit: projected value: 1
print(ee.ErrorMargin(1, 'infinite'));  // unit: infinite
// [END earthengine__apidocs__ee_errormargin]
