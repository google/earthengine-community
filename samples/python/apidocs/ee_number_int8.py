# Copyright 2023 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START earthengine__apidocs__ee_number_int8]
# Cast a number to signed 8-bit integer: [-128, 127].
number = ee.Number(100)
print('Number:', number.getInfo())

int8_number = number.int8()
print('Number cast to int8:', int8_number.getInfo())


"""Casting numbers to int8 that are outside of its range and precision can
modify the resulting value, note the behavior of the following scenarios.
"""

# A floating point number cast to int8 loses decimal precision.
float_number = ee.Number(1.7)
print('Floating point value:', float_number.getInfo())

float_to_int8 = float_number.int8()
print('Floating point value cast to int8:', float_to_int8.getInfo())

# A number greater than int8 range max cast to int8 becomes int8 range max.
INT8_MAX = 127
out_of_range_hi = ee.Number(INT8_MAX + 12345)
print('Greater than int8 max:', out_of_range_hi.getInfo())

out_of_range_hi_to_int8 = out_of_range_hi.int8()
print('Greater than int8 max cast to int8 becomes int8 max:',
      out_of_range_hi_to_int8.getInfo())

# A number greater than int8 range min cast to int8 becomes int8 range min.
INT8_MIN = -128
out_of_range_lo = ee.Number(INT8_MIN - 12345)
print('Less than int8 min:', out_of_range_lo.getInfo())

out_of_range_lo_to_int8 = out_of_range_lo.int8()
print('Less than int8 min cast to int8 becomes int8 min:',
      out_of_range_lo_to_int8.getInfo())
# [END earthengine__apidocs__ee_number_int8]
