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

// [START earthengine__apidocs__ee_number_byte]
// Cast a number to unsigned 8-bit integer: [0, 255].
var number = ee.Number(100);
print('Number:', number);

var byteNumber = number.byte();
print('Number cast to byte:', byteNumber);


/**
 * Casting numbers to byte that are outside of its range and precision can
 * modify the resulting value, note the behavior of the following scenarios.
 */

// A floating point number cast to byte loses decimal precision.
var float = ee.Number(1.7);
print('Floating point value:', float);

var floatToByte = float.byte();
print('Floating point value cast to byte:', floatToByte);

// A number greater than byte range max cast to byte becomes byte range max.
var BYTE_MAX = 255;
var outOfRangeHi = ee.Number(BYTE_MAX + 12345);
print('Greater than byte max:', outOfRangeHi);

var outOfRangeHiToByte = outOfRangeHi.byte();
print('Greater than byte max cast to byte becomes byte max:', outOfRangeHiToByte);

// A number greater than byte range min cast to byte becomes byte range min.
var BYTE_MIN = 0;
var outOfRangeLo = ee.Number(BYTE_MIN - 12345);
print('Less than byte min:', outOfRangeLo);

var outOfRangeLoToByte = outOfRangeLo.byte();
print('Less than byte min cast to byte becomes byte min:', outOfRangeLoToByte);
// [END earthengine__apidocs__ee_number_byte]
