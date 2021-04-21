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

// [START earthengine__apidocs__ee_string_rindex]
print(ee.String('aBc-Abc').rindex('A'));  // 4
print(ee.String('aBc-Abc').rindex('a'));  // 0
print(ee.String('aBc-Abc').rindex('Bc'));  // 1
print(ee.String('aBc-Abc').rindex('Z')); // -1
print(ee.String('aBc-Abc').rindex('-'));  // 3
print(ee.String('aBc-Abc').rindex(''));  // 7
// [END earthengine__apidocs__ee_string_rindex]
