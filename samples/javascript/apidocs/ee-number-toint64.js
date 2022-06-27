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

// [START earthengine__apidocs__ee_number_toint64]
// Cast a number to signed 64-bit integer: [-9223372036854776000, 9223372036854776000].
var number = ee.Number(100);
print('Number:', number);

var int64Number = number.toInt64();
print('Number cast to int64:', int64Number);


/**
 * Casting numbers to int64 that are outside of its range and precision can
 * modify the resulting value, note the behavior of the following scenarios.
 */

// A floating point number cast to int64 loses decimal precision.
var float = ee.Number(1.7);
print('Floating point value:', float);

var floatToInt64 = float.toInt64();
print('Floating point value cast to int64:', floatToInt64);

// A number greater than int64 range max cast to int64 becomes int64 range max.
var INT64_MAX = 9223372036854776000;
var outOfRangeHi = ee.Number(INT64_MAX + 12345);
print('Greater than int64 max:', outOfRangeHi);

var outOfRangeHiToInt64 = outOfRangeHi.toInt64();
print('Greater than int64 max cast to int64 becomes int64 max:', outOfRangeHiToInt64);

// A number greater than int64 range min cast to int64 becomes int64 range min.
var INT64_MIN = -9223372036854776000;
var outOfRangeLo = ee.Number(INT64_MIN - 12345);
print('Less than int64 min:', outOfRangeLo);

var outOfRangeLoToInt64 = outOfRangeLo.toInt64();
print('Less than int64 min cast to int64 becomes int64 min:', outOfRangeLoToInt64);
// [END earthengine__apidocs__ee_number_toint64]
