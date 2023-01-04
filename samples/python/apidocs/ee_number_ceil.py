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

# [START earthengine__apidocs__ee_number_ceil]
# Positive numbers.
print('Ceiling for 2.1:', ee.Number(2.1).ceil().getInfo())  # 3
print('Ceiling for 2.5:', ee.Number(2.5).ceil().getInfo())  # 3
print('Ceiling for 2.9:', ee.Number(2.9).ceil().getInfo())  # 3

# Negative numbers.
print('Ceiling for 2.1:', ee.Number(-2.1).ceil().getInfo())  # -2
print('Ceiling for 2.5:', ee.Number(-2.5).ceil().getInfo())  # -2
print('Ceiling for 2.9:', ee.Number(-2.9).ceil().getInfo())  # -2
# [END earthengine__apidocs__ee_number_ceil]
