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

// [START earthengine__apidocs__ee_number_touint32]
// Cast a number to unsigned 32-bit integer: [0, 4294967295].
var number = ee.Number(100);
print('Number:', number);

var uint32Number = number.toUint32();
print('Number cast to uint32:', uint32Number);


/**
 * Casting numbers to uint32 that are outside of its range and precision can
 * modify the resulting value, note the behavior of the following scenarios.
 */

// A floating point number cast to uint32 loses decimal precision.
var float = ee.Number(1.7);
print('Floating point value:', float);

var floatToUint32 = float.toUint32();
print('Floating point value cast to uint32:', floatToUint32);

// A number greater than uint32 range max cast to uint32 becomes uint32 range max.
var UINT32_MAX = 4294967295;
var outOfRangeHi = ee.Number(UINT32_MAX + 12345);
print('Greater than uint32 max:', outOfRangeHi);

var outOfRangeHiToUint32 = outOfRangeHi.toUint32();
print('Greater than uint32 max cast to uint32 becomes uint32 max:', outOfRangeHiToUint32);

// A number greater than uint32 range min cast to uint32 becomes uint32 range min.
var UINT32_MIN = 0;
var outOfRangeLo = ee.Number(UINT32_MIN - 12345);
print('Less than uint32 min:', outOfRangeLo);

var outOfRangeLoToUint32 = outOfRangeLo.toUint32();
print('Less than uint32 min cast to uint32 becomes uint32 min:', outOfRangeLoToUint32);
// [END earthengine__apidocs__ee_number_touint32]
