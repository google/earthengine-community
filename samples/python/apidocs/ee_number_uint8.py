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

# [START earthengine__apidocs__ee_number_uint8]
# Cast a number to unsigned 8-bit integer: [0, 255].
number = ee.Number(100)
print('Number:', number.getInfo())

uint8_number = number.uint8()
print('Number cast to uint8:', uint8_number.getInfo())


"""Casting numbers to uint8 that are outside of its range and precision can
modify the resulting value, note the behavior of the following scenarios.
"""

# A floating point number cast to uint8 loses decimal precision.
float_number = ee.Number(1.7)
print('Floating point value:', float_number.getInfo())

float_to_uint8 = float_number.uint8()
print('Floating point value cast to uint8:', float_to_uint8.getInfo())

# A number greater than uint8 range max cast to uint8 becomes uint8 range max.
UINT8_MAX = 255
out_of_range_hi = ee.Number(UINT8_MAX + 12345)
print('Greater than uint8 max:', out_of_range_hi.getInfo())

out_of_range_hi_to_uint8 = out_of_range_hi.uint8()
print('Greater than uint8 max cast to uint8 becomes uint8 max:',
      out_of_range_hi_to_uint8.getInfo())

# A number greater than uint8 range min cast to uint8 becomes uint8 range min.
UINT8_MIN = 0
out_of_range_lo = ee.Number(UINT8_MIN - 12345)
print('Less than uint8 min:', out_of_range_lo.getInfo())

out_of_range_lo_to_uint8 = out_of_range_lo.uint8()
print('Less than uint8 min cast to uint8 becomes uint8 min:',
      out_of_range_lo_to_uint8.getInfo())
# [END earthengine__apidocs__ee_number_uint8]
