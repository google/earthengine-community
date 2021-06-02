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

// [START earthengine__apidocs__ee_date_difference]
// Demonstrates the ee.Date.difference method.

var DATE_1 = ee.Date('2020-01-01');
var DATE_2 = ee.Date('2020-01-15');

var diff_1 = DATE_2.difference(DATE_1, 'days');
var diff_2 = DATE_1.difference(DATE_2, 'weeks');

print('The difference between ',
      DATE_2,
      ' relative to ',
      DATE_1,
      ' is ',
      diff_1,
      ' days.');

print('The difference between ',
      DATE_1,
      ' relative to ',
      DATE_2,
      ' is ',
      diff_2,
      ' weeks.');
// [END earthengine__apidocs__ee_date_difference]
