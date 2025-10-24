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

# [START earthengine__apidocs__ee_number_toint]
# Cast a number to signed 32-bit integer: [-2147483648, 2147483647].
number = ee.Number(100)
display('Number:', number)

int_number = number.toInt()
display('Number cast to int:', int_number)


"""Casting numbers to int that are outside of its range and precision can
modify the resulting value, note the behavior of the following scenarios.
"""

# A floating point number cast to int loses decimal precision.
float_number = ee.Number(1.7)
display('Floating point value:', float_number)

float_to_int = float_number.toInt()
display('Floating point value cast to int:', float_to_int)

# A number greater than int range max cast to int becomes int range max.
INT_MAX = 2147483647
out_of_range_hi = ee.Number(INT_MAX + 12345)
display('Greater than int max:', out_of_range_hi)

out_of_range_hi_to_int = out_of_range_hi.toInt()
display('Greater than int max cast to int becomes int max:',
        out_of_range_hi_to_int)

# A number greater than int range min cast to int becomes int range min.
INT_MIN = -2147483648
out_of_range_lo = ee.Number(INT_MIN - 12345)
display('Less than int min:', out_of_range_lo)

out_of_range_lo_to_int = out_of_range_lo.toInt()
display('Less than int min cast to int becomes int min:',
        out_of_range_lo_to_int)
# [END earthengine__apidocs__ee_number_toint]
