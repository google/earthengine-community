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

// [START earthengine__apidocs__ee_date_advance]
// Defines a base date/time for the following examples.
var BASE_DATE = ee.Date('2020-7-1T13:00', 'UTC');
print(BASE_DATE, 'The base date/time');

// Demonstrates basic usage.
print(BASE_DATE.advance(1, 'week'), '+1 week');
print(BASE_DATE.advance(2, 'years'), '+2 years');

// Demonstrates that negative delta moves back in time.
print(BASE_DATE.advance(-1, 'second'), '-1 second');
// [END earthengine__apidocs__ee_date_advance]
