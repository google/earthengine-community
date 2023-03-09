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

# [START earthengine__apidocs__ee_string_slice]
print(ee.String('').slice(0).getInfo())  # ''
print(ee.String('').slice(-1).getInfo())  # ''

s = ee.String('abcdefghijklmnopqrstuvwxyz')
print(s.slice(0).getInfo())  # abcdefghijklmnopqrstuvwxyz
print(s.slice(24).getInfo())  # yz
print(s.slice(-3).getInfo())  # xyz
print(s.slice(3, 3).getInfo())  # ''
print(s.slice(2, 3).getInfo())  # c
print(s.slice(-4, 25).getInfo())  # wxy
# [END earthengine__apidocs__ee_string_slice]
