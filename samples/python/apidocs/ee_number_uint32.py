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

# [START earthengine__apidocs__ee_number_uint32]
# Cast a number to unsigned 32-bit integer: [0, 4294967295].
number = ee.Number(100)
print('Number:', number.getInfo())

uint32_number = number.uint32()
print('Number cast to uint32:', uint32_number.getInfo())


"""Casting numbers to uint32 that are outside of its range and precision can
modify the resulting value, note the behavior of the following scenarios.
"""

# A floating point number cast to uint32 loses decimal precision.
float_number = ee.Number(1.7)
print('Floating point value:', float_number.getInfo())

float_to_uint32 = float_number.uint32()
print('Floating point value cast to uint32:', float_to_uint32.getInfo())

# A number greater than uint32 range max cast to uint32
# becomes uint32 range max.
UINT32_MAX = 4294967295
out_of_range_hi = ee.Number(UINT32_MAX + 12345)
print('Greater than uint32 max:', out_of_range_hi.getInfo())

out_of_range_hi_to_uint32 = out_of_range_hi.uint32()
print('Greater than uint32 max cast to uint32 becomes uint32 max:',
      out_of_range_hi_to_uint32.getInfo())

# A number greater than uint32 range min cast to uint32
# becomes uint32 range min.
UINT32_MIN = 0
out_of_range_lo = ee.Number(UINT32_MIN - 12345)
print('Less than uint32 min:', out_of_range_lo.getInfo())

out_of_range_lo_to_uint32 = out_of_range_lo.uint32()
print('Less than uint32 min cast to uint32 becomes uint32 min:',
      out_of_range_lo_to_uint32.getInfo())
# [END earthengine__apidocs__ee_number_uint32]
