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

// [START earthengine__apidocs__ee_number_uint16]
// Cast a number to unsigned 16-bit integer: [0, 65535].
var number = ee.Number(100);
print('Number:', number);

var uint16Number = number.uint16();
print('Number cast to uint16:', uint16Number);


/**
 * Casting numbers to uint16 that are outside of its range and precision can
 * modify the resulting value, note the behavior of the following scenarios.
 */

// A floating point number cast to uint16 loses decimal precision.
var float = ee.Number(1.7);
print('Floating point value:', float);

var floatToUint16 = float.uint16();
print('Floating point value cast to uint16:', floatToUint16);

// A number greater than uint16 range max cast to uint16 becomes uint16 range max.
var UINT16_MAX = 65535;
var outOfRangeHi = ee.Number(UINT16_MAX + 12345);
print('Greater than uint16 max:', outOfRangeHi);

var outOfRangeHiToUint16 = outOfRangeHi.uint16();
print('Greater than uint16 max cast to uint16 becomes uint16 max:', outOfRangeHiToUint16);

// A number greater than uint16 range min cast to uint16 becomes uint16 range min.
var UINT16_MIN = 0;
var outOfRangeLo = ee.Number(UINT16_MIN - 12345);
print('Less than uint16 min:', outOfRangeLo);

var outOfRangeLoToUint16 = outOfRangeLo.uint16();
print('Less than uint16 min cast to uint16 becomes uint16 min:', outOfRangeLoToUint16);
// [END earthengine__apidocs__ee_number_uint16]
