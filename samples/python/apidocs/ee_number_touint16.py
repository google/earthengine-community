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

# [START earthengine__apidocs__ee_number_touint16]
# Cast a number to unsigned 16-bit integer: [0, 65535].
number = ee.Number(100)
print('Number:', number.getInfo())

uint16_number = number.toUint16()
print('Number cast to uint16:', uint16_number.getInfo())


"""Casting numbers to uint16 that are outside of its range and precision can
modify the resulting value, note the behavior of the following scenarios.
"""

# A floating point number cast to uint16 loses decimal precision.
float_number = ee.Number(1.7)
print('Floating point value:', float_number.getInfo())

float_to_uint16 = float_number.toUint16()
print('Floating point value cast to uint16:', float_to_uint16.getInfo())

# A number greater than uint16 range max cast to uint16
# becomes uint16 range max.
UINT16_MAX = 65535
out_of_range_hi = ee.Number(UINT16_MAX + 12345)
print('Greater than uint16 max:', out_of_range_hi.getInfo())

out_of_range_hi_to_uint16 = out_of_range_hi.toUint16()
print('Greater than uint16 max cast to uint16 becomes uint16 max:',
      out_of_range_hi_to_uint16.getInfo())

# A number greater than uint16 range min cast to uint16
# becomes uint16 range min.
UINT16_MIN = 0
out_of_range_lo = ee.Number(UINT16_MIN - 12345)
print('Less than uint16 min:', out_of_range_lo.getInfo())

out_of_range_lo_to_uint16 = out_of_range_lo.toUint16()
print('Less than uint16 min cast to uint16 becomes uint16 min:',
      out_of_range_lo_to_uint16.getInfo())
# [END earthengine__apidocs__ee_number_touint16]
