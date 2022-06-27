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

// [START earthengine__apidocs__ee_number_int8]
// Cast a number to signed 8-bit integer: [-128, 127].
var number = ee.Number(100);
print('Number:', number);

var int8Number = number.int8();
print('Number cast to int8:', int8Number);


/**
 * Casting numbers to int8 that are outside of its range and precision can
 * modify the resulting value, note the behavior of the following scenarios.
 */

// A floating point number cast to int8 loses decimal precision.
var float = ee.Number(1.7);
print('Floating point value:', float);

var floatToInt8 = float.int8();
print('Floating point value cast to int8:', floatToInt8);

// A number greater than int8 range max cast to int8 becomes int8 range max.
var INT8_MAX = 127;
var outOfRangeHi = ee.Number(INT8_MAX + 12345);
print('Greater than int8 max:', outOfRangeHi);

var outOfRangeHiToInt8 = outOfRangeHi.int8();
print('Greater than int8 max cast to int8 becomes int8 max:', outOfRangeHiToInt8);

// A number greater than int8 range min cast to int8 becomes int8 range min.
var INT8_MIN = -128;
var outOfRangeLo = ee.Number(INT8_MIN - 12345);
print('Less than int8 min:', outOfRangeLo);

var outOfRangeLoToInt8 = outOfRangeLo.int8();
print('Less than int8 min cast to int8 becomes int8 min:', outOfRangeLoToInt8);
// [END earthengine__apidocs__ee_number_int8]
