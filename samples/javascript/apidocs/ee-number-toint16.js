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

// [START earthengine__apidocs__ee_number_toint16]
// Cast a number to signed 16-bit integer: [-32768, 32767].
var number = ee.Number(100);
print('Number:', number);

var int16Number = number.toInt16();
print('Number cast to int16:', int16Number);


/**
 * Casting numbers to int16 that are outside of its range and precision can
 * modify the resulting value, note the behavior of the following scenarios.
 */

// A floating point number cast to int16 loses decimal precision.
var float = ee.Number(1.7);
print('Floating point value:', float);

var floatToInt16 = float.toInt16();
print('Floating point value cast to int16:', floatToInt16);

// A number greater than int16 range max cast to int16 becomes int16 range max.
var INT16_MAX = 32767;
var outOfRangeHi = ee.Number(INT16_MAX + 12345);
print('Greater than int16 max:', outOfRangeHi);

var outOfRangeHiToInt16 = outOfRangeHi.toInt16();
print('Greater than int16 max cast to int16 becomes int16 max:', outOfRangeHiToInt16);

// A number greater than int16 range min cast to int16 becomes int16 range min.
var INT16_MIN = -32768;
var outOfRangeLo = ee.Number(INT16_MIN - 12345);
print('Less than int16 min:', outOfRangeLo);

var outOfRangeLoToInt16 = outOfRangeLo.toInt16();
print('Less than int16 min cast to int16 becomes int16 min:', outOfRangeLoToInt16);
// [END earthengine__apidocs__ee_number_toint16]
