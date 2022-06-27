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

// [START earthengine__apidocs__ee_number_tolong]
// Declare an ee.Number.
var number = ee.Number(100);
print('ee.Number:', number);

// Cast a number to signed 64-bit integer.
var longNumber = number.toLong();
print('ee.Number cast to long:', longNumber);


/**
* Casting numbers to long that are outside of its range and precision can
* modify the resulting value, note the behavior of the following scenarios.
*/

// A floating point number cast to long loses decimal precision.
var float = ee.Number(1.7);
print('Floating point value:', float);

var floatToLong = float.toLong();
print('Floating point value cast to long:', floatToLong);
// [END earthengine__apidocs__ee_number_tolong]
