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

# [START earthengine__apidocs__ee_array_accum]
print(ee.Array([-1]).accum(0).getInfo())  # [-1]
print(ee.Array([-2, 1]).accum(0).getInfo())  # [-2, -1]
print(ee.Array([-2, 1, 9]).accum(0).getInfo())  # [-2, -1, 8]

# accum over 2D arrays with different axes.
print(ee.Array([[1, 3], [5, 7]]).accum(0).getInfo())  # [[1, 3],[6, 10]]
print(ee.Array([[1, 3], [5, 7]]).accum(1).getInfo())  # [[1, 4],[5, 12]]

# sum is the default reducer.
print(ee.Array([2, -2, 3, 1]).accum(0).getInfo())  # [2, 0, 3, 4]

# [2, 0, 3, 4]
print(ee.Array([2, -2, 3, 1]).accum(0, ee.Reducer.sum()).getInfo())


# Some example reducers.
# [2, 2, 3, 3]
print(ee.Array([2, -2, 3, 1]).accum(0, ee.Reducer.max()).getInfo())


# [2, 0, 1, 1]
print(ee.Array([2, -2, 3, 1]).accum(0, ee.Reducer.mean()).getInfo())

# [2, -2, -2, -2]
print(ee.Array([2, -2, 3, 1]).accum(0, ee.Reducer.min()).getInfo())

# [2, -4, -12]
print(ee.Array([2, -2, 3]).accum(0, ee.Reducer.product()).getInfo())
# [END earthengine__apidocs__ee_array_accum]
