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

# [START earthengine__apidocs__ee_array_mask]
print(ee.Array([1]).mask([0]).getInfo())  # []
print(ee.Array([1]).mask([1]).getInfo())  # [1]

print(ee.Array([0, 1, 2, 3]).mask([0, 4, -1, 1.2]).getInfo())  # [1, 2, 3]

print(ee.Array([[1, 2, 3, 4]]).mask([[0, 0, 0, 0]]).getInfo())  # [[]]
print(ee.Array([[1, 2, 3, 4]]).mask([[1, 0, 1, 1]]).getInfo())  # [[1, 3, 4]]

array = ee.Array([[1], [2], [3], [4]])
print(array.mask([[0], [0], [0], [0]]).getInfo())  # []
print(array.mask([[1], [0], [1], [1]]).getInfo())  # [[1], [3], [4]]

empty = ee.Array([], ee.PixelType.int8())
print(empty.mask(empty).getInfo())  # []
# [END earthengine__apidocs__ee_array_mask]