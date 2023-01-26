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

# [START earthengine__apidocs__ee_number_tofloat]
# Declare an ee.Number.
number = ee.Number(100)
print('ee.Number:', number.getInfo())

# Cast a number to signed 32-bit floating point number.
float_number = number.toFloat()
print('ee.Number cast to float:', float_number.getInfo())
# [END earthengine__apidocs__ee_number_tofloat]
