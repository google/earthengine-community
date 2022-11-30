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

# [START earthengine__apidocs__ee_array_slice]
array1x6 = ee.Array([1, 2, 3, 4, 5, 6])
print(array1x6.slice().getInfo())  # [1, 2, 3, 4, 5, 6]
print(array1x6.slice(0).getInfo())  # [1, 2, 3, 4, 5, 6]
print(array1x6.slice(0, 0, 6, 1).getInfo())  # [1, 2, 3, 4, 5, 6]
print(array1x6.slice(0, 0, 10, 1).getInfo())  # [1, 2, 3, 4, 5, 6]

print(array1x6.slice(0, 2).getInfo())  # [3, 4, 5, 6]
print(array1x6.slice(0, 5).getInfo())  # [6]
print(array1x6.slice(0, 6).getInfo())  # []
print(array1x6.slice(0, 0, 2).getInfo())  # [1, 2]
print(array1x6.slice(0, 0, 0).getInfo())  # []

# Negative start and end.
print(array1x6.slice(0, 0, -3).getInfo())  # [1, 2, 3]
print(array1x6.slice(0, -2, 6).getInfo())  # [5, 6]

print(array1x6.slice(0, 0, 6, 2).getInfo())  # [1, 3, 5]
print(array1x6.slice(0, 0, 6, 3).getInfo())  # [1, 4]
print(array1x6.slice(0, 0, 6, 4).getInfo())  # [1, 5]
print(array1x6.slice(0, 0, 6, 6).getInfo())  # [1]

print(array1x6.slice(0, 2, 6, 2).getInfo())  # [3, 5]

array3x2 = ee.Array([[1, 2], [3, 4], [5, 6]])
print(array3x2.slice().getInfo())  # [[1, 2], [3, 4], [5, 6]]
print(array3x2.slice(0).getInfo())  # [[1, 2], [3, 4], [5, 6]]
print(array3x2.slice(0, 0).getInfo())  # [[1, 2],[3, 4],[5, 6]]
print(array3x2.slice(0, 0, 1).getInfo())  # [[1, 2]]
print(array3x2.slice(0, 0, 2).getInfo())  # [[1, 2], [3, 4]]
print(array3x2.slice(0, 0, 3, 1).getInfo())  # [[1, 2], [3, 4], [5, 6]]
print(array3x2.slice(0, 0, 3, 2).getInfo())  # [[1, 2], [5, 6]]
print(array3x2.slice(0, 1, 3, 2).getInfo())  # [[3, 4]]
print(array3x2.slice(0, 0, 3, 3).getInfo())  # [[1, 2]]

print(array3x2.slice(1).getInfo())  # [[1, 2], [3, 4], [5, 6]]
print(array3x2.slice(1, 1).getInfo())  # [[2], [4], [6]]
print(array3x2.slice(1, 0, 1).getInfo())  # [[1], [3], [5]]

empty = ee.Array([], ee.PixelType.int8())
print(empty.slice().getInfo())  # []
print(empty.slice(0).getInfo())  # []
print(empty.slice(0, 0, 0, 1).getInfo())  # []
# [END earthengine__apidocs__ee_array_slice]