/**
 * Copyright 2022 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_string_equals]
var sp = ee.String('Abies grandis');

print('"Abies grandis" equals "Abies grandis"?', sp.equals('Abies grandis'));
print('"Abies grandis" equals "abies grandis"?', sp.equals('abies grandis'));
print('"Abies grandis" equals "Thuja plicata"?', sp.equals('Thuja plicata'));
// [END earthengine__apidocs__ee_string_equals]
