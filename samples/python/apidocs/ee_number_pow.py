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

# [START earthengine__apidocs__ee_number_pow]
print('5 ** 2', ee.Number(5).pow(ee.Number(2)).getInfo())  # 25
print('-5 ** 2', ee.Number(-5).pow(ee.Number(2)).getInfo())  # 25
print('5 ** -2', ee.Number(5).pow(ee.Number(-2)).getInfo())  # 0.04
print('5 ** 2.2', ee.Number(5).pow(ee.Number(2.2)).getInfo())  # 34.493241536
print('5.2 ** 2', ee.Number(5.2).pow(ee.Number(2)).getInfo())  # 27.040000000
# [END earthengine__apidocs__ee_number_pow]
