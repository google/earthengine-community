# Copyright 2022 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_number_byte]
# Cast a number to unsigned 8-bit integer: [0, 255].
number = ee.Number(100)
print('Number:', number.getInfo())

byte_number = number.byte()
print('Number cast to byte:', byte_number.getInfo())


"""Casting numbers to byte that are outside of its range and precision can
modify the resulting value, note the behavior of the following scenarios.
"""

# A floating point number cast to byte loses decimal precision.
float_number = ee.Number(1.7)
print('Floating point value:', float_number.getInfo())

float_to_byte = float_number.byte()
print('Floating point value cast to byte:', float_to_byte.getInfo())

# A number greater than byte range max cast to byte becomes byte range max.
BYTE_MAX = 255
out_of_range_hi = ee.Number(BYTE_MAX + 12345)
print('Greater than byte max:', out_of_range_hi.getInfo())

out_of_range_hi_to_byte = out_of_range_hi.byte()
print('Greater than byte max cast to byte becomes byte max:',
      out_of_range_hi_to_byte.getInfo())

# A number greater than byte range min cast to byte becomes byte range min.
BYTE_MIN = 0
out_of_range_lo = ee.Number(BYTE_MIN - 12345)
print('Less than byte min:', out_of_range_lo.getInfo())

out_of_range_lo_to_byte = out_of_range_lo.byte()
print('Less than byte min cast to byte becomes byte min:',
      out_of_range_lo_to_byte.getInfo())
# [END earthengine__apidocs__ee_number_byte]
