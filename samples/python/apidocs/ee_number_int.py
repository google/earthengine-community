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

# [START earthengine__apidocs__ee_number_int]
# Cast a number to signed 32-bit integer: [-2147483648, 2147483647].
number = ee.Number(100)
print('Number:', number.getInfo())

int_number = number.int()
print('Number cast to int:', int_number.getInfo())


"""Casting numbers to int that are outside of its range and precision can
modify the resulting value, note the behavior of the following scenarios.
"""

# A floating point number cast to int loses decimal precision.
float_number = ee.Number(1.7)
print('Floating point value:', float_number.getInfo())

float_to_int = float_number.int()
print('Floating point value cast to int:', float_to_int.getInfo())

# A number greater than int range max cast to int becomes int range max.
INT_MAX = 2147483647
out_of_range_hi = ee.Number(INT_MAX + 12345)
print('Greater than int max:', out_of_range_hi.getInfo())

out_of_range_hi_to_int = out_of_range_hi.int()
print('Greater than int max cast to int becomes int max:',
      out_of_range_hi_to_int.getInfo())

# A number greater than int range min cast to int becomes int range min.
INT_MIN = -2147483648
out_of_range_lo = ee.Number(INT_MIN - 12345)
print('Less than int min:', out_of_range_lo.getInfo())

out_of_range_lo_to_int = out_of_range_lo.int()
print('Less than int min cast to int becomes int min:',
      out_of_range_lo_to_int.getInfo())
# [END earthengine__apidocs__ee_number_int]
