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

# [START earthengine__apidocs__ee_array_eigen]
display(ee.Array([[0, 0], [0, 0]]).eigen())  # [[0, 0, 1], [0, 1, 0]]

display(ee.Array([[1, 0], [0, 0]]).eigen())  # [[1, 1, 0], [0,0,1]]
display(ee.Array([[0, 1], [0, 0]]).eigen())  # [[0, 0, 1], [0, 1, 0]]
display(ee.Array([[0, 0], [1, 0]]).eigen())  # [[0, -1, 0], [0, 0, -1]]
display(ee.Array([[0, 0], [0, 1]]).eigen())  # [[1, 0, 1], [0, 1, 0]]

# [[1, 1, 0], [0, -1/√2, 1/√2]]
display(ee.Array([[1, 1], [0, 0]]).eigen())

# [[1, 0, -1], [0, -1/√2, 1/√2]]]
display(ee.Array([[0, 0], [1, 1]]).eigen())

# [[1, 1/√2, 1/√2], [0, 0, 1]]
display(ee.Array([[1, 0], [1, 0]]).eigen())
display(ee.Array([[1, 0], [0, 1]]).eigen())  # [[1, 1, 0], [1, 0, 1]]

# [[1, 1/√2, 1/√2], [-1, 1/√2, -1/√2]]
display(ee.Array([[0, 1], [1, 0]]).eigen())

# [[1, 1/√2, 1/√2], [0, 1, 0]]
display(ee.Array([[0, 1], [0, 1]]).eigen())

# [[1.62, 0.85, 0.53], [-0.62, 0.53]]
display(ee.Array([[1, 1], [1, 0]]).eigen())
display(ee.Array([[1, 1], [0, 1]]).eigen())  # [[1, 0, 1], [1, 1, 0]]
display(ee.Array([[1, 0], [1, 1]]).eigen())  # [[1, -1, 0], [1, 0, -1]]

# [[1.62, -0.53, -0.85], [-0.62, -0.85, 0.53]]
display(ee.Array([[0, 1], [1, 1]]).eigen())

# [[2, 1/√2, 1/√2], [0, 1/√2, -1/√2]]
display(ee.Array([[1, 1], [1, 1]]).eigen())

matrix = ee.Array([
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]])
display(matrix.eigen())  # [[1, 1, 0, 0], [1, 0, 1, 0], [1, 0, 0, 1]]

matrix = ee.Array([
  [2, 0, 0],
  [0, 3, 0],
  [0, 0, 4]])
display(matrix.eigen())  # [[4, 0, 0, 1], [3, 0, 1, 0], [2, 1, 0, 0]]

matrix = ee.Array([
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 0]])
display(matrix.eigen())  # [[1, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]

matrix = ee.Array([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1]])
# [[3, -0.58, -0.58, -0.58], [0, 0, -1/√2, 1/√2], [0, -0.82, 0.41, 0.41]]
display(matrix.eigen())
# [END earthengine__apidocs__ee_array_eigen]