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

# [START earthengine__apidocs__ee_number_short]
# Cast a number to signed 16-bit integer: [-32768, 32767].
number = ee.Number(100)
print('Number:', number.getInfo())

short_number = number.short()
print('Number cast to short:', short_number.getInfo())


"""Casting numbers to short that are outside of its range and precision can
modify the resulting value, note the behavior of the following scenarios.
"""

# A floating point number cast to short loses decimal precision.
float_number = ee.Number(1.7)
print('Floating point value:', float_number.getInfo())

float_to_short = float_number.short()
print('Floating point value cast to short:', float_to_short.getInfo())

# A number greater than short range max cast to short becomes short range max.
SHORT_MAX = 32767
out_of_range_hi = ee.Number(SHORT_MAX + 12345)
print('Greater than short max:', out_of_range_hi.getInfo())

out_of_range_hi_to_short = out_of_range_hi.short()
print('Greater than short max cast to short becomes short max:',
      out_of_range_hi_to_short.getInfo())

# A number greater than short range min cast to short becomes short range min.
SHORT_MIN = -32768
out_of_range_lo = ee.Number(SHORT_MIN - 12345)
print('Less than short min:', out_of_range_lo.getInfo())

out_of_range_lo_to_short = out_of_range_lo.short()
print('Less than short min cast to short becomes short min:',
      out_of_range_lo_to_short.getInfo())
# [END earthengine__apidocs__ee_number_short]
