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

# [START earthengine__apidocs__ee_number_long]
# Declare an ee.Number.
number = ee.Number(100)
print('ee.Number:', number.getInfo())

# Cast a number to signed 64-bit integer.
long_number = number.long()
print('ee.Number cast to long:', long_number.getInfo())


"""Casting numbers to long that are outside of its range and precision can
modify the resulting value, note the behavior of the following scenarios.
"""

# A floating point number cast to long loses decimal precision.
float_number = ee.Number(1.7)
print('Floating point value:', float_number.getInfo())

float_to_long = float_number.long()
print('Floating point value cast to long:', float_to_long.getInfo())
# [END earthengine__apidocs__ee_number_long]
