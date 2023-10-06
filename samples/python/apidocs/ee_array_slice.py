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
display(array1x6.slice())  # [1, 2, 3, 4, 5, 6]
display(array1x6.slice(0))  # [1, 2, 3, 4, 5, 6]
display(array1x6.slice(0, 0, 6, 1))  # [1, 2, 3, 4, 5, 6]
display(array1x6.slice(0, 0, 10, 1))  # [1, 2, 3, 4, 5, 6]

display(array1x6.slice(0, 2))  # [3, 4, 5, 6]
display(array1x6.slice(0, 5))  # [6]
display(array1x6.slice(0, 6))  # []
display(array1x6.slice(0, 0, 2))  # [1, 2]
display(array1x6.slice(0, 0, 0))  # []

# Negative start and end.
display(array1x6.slice(0, 0, -3))  # [1, 2, 3]
display(array1x6.slice(0, -2, 6))  # [5, 6]

display(array1x6.slice(0, 0, 6, 2))  # [1, 3, 5]
display(array1x6.slice(0, 0, 6, 3))  # [1, 4]
display(array1x6.slice(0, 0, 6, 4))  # [1, 5]
display(array1x6.slice(0, 0, 6, 6))  # [1]

display(array1x6.slice(0, 2, 6, 2))  # [3, 5]

array3x2 = ee.Array([[1, 2], [3, 4], [5, 6]])
display(array3x2.slice())  # [[1, 2], [3, 4], [5, 6]]
display(array3x2.slice(0))  # [[1, 2], [3, 4], [5, 6]]
display(array3x2.slice(0, 0))  # [[1, 2],[3, 4],[5, 6]]
display(array3x2.slice(0, 0, 1))  # [[1, 2]]
display(array3x2.slice(0, 0, 2))  # [[1, 2], [3, 4]]
display(array3x2.slice(0, 0, 3, 1))  # [[1, 2], [3, 4], [5, 6]]
display(array3x2.slice(0, 0, 3, 2))  # [[1, 2], [5, 6]]
display(array3x2.slice(0, 1, 3, 2))  # [[3, 4]]
display(array3x2.slice(0, 0, 3, 3))  # [[1, 2]]

display(array3x2.slice(1))  # [[1, 2], [3, 4], [5, 6]]
display(array3x2.slice(1, 1))  # [[2], [4], [6]]
display(array3x2.slice(1, 0, 1))  # [[1], [3], [5]]

empty = ee.Array([], ee.PixelType.int8())
display(empty.slice())  # []
display(empty.slice(0))  # []
display(empty.slice(0, 0, 0, 1))  # []
# [END earthengine__apidocs__ee_array_slice]