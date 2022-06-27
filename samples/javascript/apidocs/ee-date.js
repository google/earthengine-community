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

// [START earthengine__apidocs__ee_date]
// Numeric inputs are interpreted as milliseconds from Unix epoch.
print(ee.Date(0));  // Date (1970-01-01 00:00:00)

// Scale factors can make numerical inputs more readable (e.g. 60 seconds).
print(ee.Date(60 * 1000));  // Date (1970-01-01 00:01:00)

// ISO 8601 date string input examples.
print(ee.Date('2020'));  // Date (2020-01-01 00:00:00)
print(ee.Date('2017-6-24'));  // Date (2017-06-24 00:00:00)
print(ee.Date('2017-06-24'));  // Date (2017-06-24 00:00:00)
print(ee.Date('2017-6-24T00:14:46'));  // Date (2017-06-24 00:14:46)
print(ee.Date('2017-06-24T23:59:59'));  // Date (2017-06-24 23:59:59)

// Convert JavaScript now to Earth Engine Date
print(ee.Date(Date.now()));
// [END earthengine__apidocs__ee_date]
