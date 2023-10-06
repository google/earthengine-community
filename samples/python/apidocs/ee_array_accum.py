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
display(ee.Array([-1]).accum(0))  # [-1]
display(ee.Array([-2, 1]).accum(0))  # [-2, -1]
display(ee.Array([-2, 1, 9]).accum(0))  # [-2, -1, 8]

# accum over 2D arrays with different axes.
display(ee.Array([[1, 3], [5, 7]]).accum(0))  # [[1, 3],[6, 10]]
display(ee.Array([[1, 3], [5, 7]]).accum(1))  # [[1, 4],[5, 12]]

# sum is the default reducer.
display(ee.Array([2, -2, 3, 1]).accum(0))  # [2, 0, 3, 4]

# [2, 0, 3, 4]
display(ee.Array([2, -2, 3, 1]).accum(0, ee.Reducer.sum()))


# Some example reducers.
# [2, 2, 3, 3]
display(ee.Array([2, -2, 3, 1]).accum(0, ee.Reducer.max()))


# [2, 0, 1, 1]
display(ee.Array([2, -2, 3, 1]).accum(0, ee.Reducer.mean()))

# [2, -2, -2, -2]
display(ee.Array([2, -2, 3, 1]).accum(0, ee.Reducer.min()))

# [2, -4, -12]
display(ee.Array([2, -2, 3]).accum(0, ee.Reducer.product()))
# [END earthengine__apidocs__ee_array_accum]
