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

// [START earthengine__apidocs__ee_number_short]
// Cast a number to signed 16-bit integer: [-32768, 32767].
var number = ee.Number(100);
print('Number:', number);

var shortNumber = number.short();
print('Number cast to short:', shortNumber);


/**
 * Casting numbers to short that are outside of its range and precision can
 * modify the resulting value, note the behavior of the following scenarios.
 */

// A floating point number cast to short loses decimal precision.
var float = ee.Number(1.7);
print('Floating point value:', float);

var floatToShort = float.short();
print('Floating point value cast to short:', floatToShort);

// A number greater than short range max cast to short becomes short range max.
var SHORT_MAX = 32767;
var outOfRangeHi = ee.Number(SHORT_MAX + 12345);
print('Greater than short max:', outOfRangeHi);

var outOfRangeHiToShort = outOfRangeHi.short();
print('Greater than short max cast to short becomes short max:', outOfRangeHiToShort);

// A number greater than short range min cast to short becomes short range min.
var SHORT_MIN = -32768;
var outOfRangeLo = ee.Number(SHORT_MIN - 12345);
print('Less than short min:', outOfRangeLo);

var outOfRangeLoToShort = outOfRangeLo.short();
print('Less than short min cast to short becomes short min:', outOfRangeLoToShort);
// [END earthengine__apidocs__ee_number_short]
