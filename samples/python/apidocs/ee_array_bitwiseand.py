# Copyright 2021 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_array_bitwiseand]
empty = ee.Array([], ee.PixelType.int8())
print(empty.bitwiseAnd(empty).getInfo())  # []

print(ee.Array(0).bitwiseAnd(ee.Array(0)).getInfo())  # 0
print(ee.Array(0).bitwiseAnd(ee.Array(1)).getInfo())  # 0
print(ee.Array(1).bitwiseAnd(ee.Array(0)).getInfo())  # 0
print(ee.Array(1).bitwiseAnd(ee.Array(1)).getInfo())  # 1
print(ee.Array(0xFF).bitwiseAnd(ee.Array(0xFFFF)).getInfo())  # 255
print(ee.Array(0xFFFF).bitwiseAnd(ee.Array(0xFF)).getInfo())  # 255

print(ee.Array(-1).bitwiseAnd(ee.Array(0xFF)).getInfo())  # 255
print(ee.Array(-1).bitwiseAnd(ee.Array(-2)).getInfo())  # -2

print(ee.Array([6, 6]).bitwiseAnd(ee.Array([1, 11])).getInfo())  # [0, 2]
# [END earthengine__apidocs__ee_array_bitwiseand]
