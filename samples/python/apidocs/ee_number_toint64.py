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

# [START earthengine__apidocs__ee_number_toint64]
# Cast a number to signed 64-bit integer:
# [-9223372036854775808, 9223372036854775808].
number = ee.Number(100)
print('Number:', number.getInfo())

int64_number = number.toInt64()
print('Number cast to int64:', int64_number.getInfo())


"""Casting numbers to int64 that are outside of its range and precision can
modify the resulting value, note the behavior of the following scenarios.
"""

# A floating point number cast to int64 loses decimal precision.
float_number = ee.Number(1.7)
print('Floating point value:', float_number.getInfo())

float_to_int64 = float_number.toInt64()
print('Floating point value cast to int64:', float_to_int64.getInfo())

# A number greater than int64 range max becomes int64 range max.
# Python int is too large to be mapped to int64, use float instead.
INT64_MAX = 9223372036854775808.0
out_of_range_hi = ee.Number(INT64_MAX + 12345)
print('Greater than int64 max:', '{:.0f}'.format(out_of_range_hi.getInfo()))

out_of_range_hi_to_int64 = out_of_range_hi.toInt64()
print('Greater than int64 max cast to int64 becomes int64 max:',
      '{:.0f}'.format(out_of_range_hi_to_int64.getInfo()))

# A number greater than int64 range min becomes int64 range min.
# Python int is too large to be mapped to int64, use float instead.
INT64_MIN = -9223372036854775808.0
out_of_range_lo = ee.Number(INT64_MIN - 12345)
print('Less than int64 min:', '{:.0f}'.format(out_of_range_lo.getInfo()))

out_of_range_lo_to_int64 = out_of_range_lo.toInt64()
print('Less than int64 min cast to int64 becomes int64 min:',
      '{:.0f}'.format(out_of_range_lo_to_int64.getInfo()))
# [END earthengine__apidocs__ee_number_toint64]
