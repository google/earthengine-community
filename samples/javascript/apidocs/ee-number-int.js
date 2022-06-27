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

// [START earthengine__apidocs__ee_number_int]
// Cast a number to signed 32-bit integer: [-2147483648, 2147483647].
var number = ee.Number(100);
print('Number:', number);

var intNumber = number.int();
print('Number cast to int:', intNumber);


/**
 * Casting numbers to int that are outside of its range and precision can
 * modify the resulting value, note the behavior of the following scenarios.
 */

// A floating point number cast to int loses decimal precision.
var float = ee.Number(1.7);
print('Floating point value:', float);

var floatToInt = float.int();
print('Floating point value cast to int:', floatToInt);

// A number greater than int range max cast to int becomes int range max.
var INT_MAX = 2147483647;
var outOfRangeHi = ee.Number(INT_MAX + 12345);
print('Greater than int max:', outOfRangeHi);

var outOfRangeHiToInt = outOfRangeHi.int();
print('Greater than int max cast to int becomes int max:', outOfRangeHiToInt);

// A number greater than int range min cast to int becomes int range min.
var INT_MIN = -2147483648;
var outOfRangeLo = ee.Number(INT_MIN - 12345);
print('Less than int min:', outOfRangeLo);

var outOfRangeLoToInt = outOfRangeLo.int();
print('Less than int min cast to int becomes int min:', outOfRangeLoToInt);
// [END earthengine__apidocs__ee_number_int]
