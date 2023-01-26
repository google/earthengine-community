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

# [START earthengine__apidocs__ee_number_int32]
# Cast a number to signed 32-bit integer: [-2147483648, 2147483647].
number = ee.Number(100)
print('Number:', number.getInfo())

int32_number = number.int32()
print('Number cast to int32:', int32_number.getInfo())


"""Casting numbers to int32 that are outside of its range and precision can
modify the resulting value, note the behavior of the following scenarios.
"""

# A floating point number cast to int32 loses decimal precision.
float_number = ee.Number(1.7)
print('Floating point value:', float_number.getInfo())

float_to_int32 = float_number.int32()
print('Floating point value cast to int32:', float_to_int32.getInfo())

# A number greater than int32 range max cast to int32 becomes int32 range max.
INT32_MAX = 2147483647
out_of_range_hi = ee.Number(INT32_MAX + 12345)
print('Greater than int32 max:', out_of_range_hi.getInfo())

out_of_range_hi_to_int32 = out_of_range_hi.int32()
print('Greater than int32 max cast to int32 becomes int32 max:',
      out_of_range_hi_to_int32.getInfo())

# A number greater than int32 range min cast to int32 becomes int32 range min.
INT32_MIN = -2147483648
out_of_range_lo = ee.Number(INT32_MIN - 12345)
print('Less than int32 min:', out_of_range_lo.getInfo())

out_of_range_lo_to_int32 = out_of_range_lo.int32()
print('Less than int32 min cast to int32 becomes int32 min:',
      out_of_range_lo_to_int32.getInfo())
# [END earthengine__apidocs__ee_number_int32]
