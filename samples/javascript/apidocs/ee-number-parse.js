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

// [START earthengine__apidocs__ee_number_parse]
print('Client-side string converted to ee.Number',
      ee.Number.parse('10'));  // 10

print('ee.String converted to ee.Number',
      ee.Number.parse(ee.String('100')));  // 100

print('Ambiguous string object converted to ee.Number',
      ee.Number.parse(ee.Feature(null, {id: '1000'}).get('id')));  // 1000

print('Ambiguous number object converted to ee.Number',
      ee.Number.parse(ee.Feature(null, {id: 1000}).get('id')));  // 1000

print('Leading zeros are removed',
      ee.Number.parse('0001'));  // 1
// [END earthengine__apidocs__ee_number_parse]
