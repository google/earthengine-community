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

// [START earthengine__apidocs__ee_string]
print(ee.String('I am a string'));  // I am a string

// Strings can use emoji.
print(ee.String('🧲⚡️👀'));  // 🧲⚡️👀

// Empty string.
var empty = ee.String('');
print(empty);  // ''
print(empty.length());  // 0
// [END earthengine__apidocs__ee_string]
