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

# [START earthengine__apidocs__ee_number_format]
display('Zero-fill to length of 3:',
        ee.Number(1).format('%03d'))  # 001

display('Include 1 decimal place in 1.2347:',
        ee.Number(1.23476).format('%.1f'))  # 1.2

display('Include 3 decimal places in 1.2347:',
        ee.Number(1.23476).format('%.3f'))  # 1.235 (rounds up)

display('Scientific notation with 3 decimal places shown:',
        ee.Number(123476).format('%.3e'))  # 1.235e+05 (rounds up)

display('Integer with 2 decimal places of precision:',
        ee.Number(123476).format('%.2f'))  # 123476.00
# [END earthengine__apidocs__ee_number_format]
