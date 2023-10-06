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

# [START earthengine__apidocs__ee_array_first_nonzero]
empty = ee.Array([], ee.PixelType.int8())
display(empty.first_nonzero(empty))  # []

display(ee.Array([0]).first_nonzero(0))  # [0]
display(ee.Array([0]).first_nonzero([0]))  # [0]
display(ee.Array([0]).first_nonzero([1]))  # [1]
display(ee.Array([2]).first_nonzero([3]))  # [2]
display(ee.Array([1]).first_nonzero([0]))  # [1]

display(ee.Array([-1, 0, 1]).first_nonzero([2, -1, 2]))  # [-1, -1, 1]

# [[1, 2], [3, 4]]
display(ee.Array([[1, 2], [0, 0]]).first_nonzero([[0, 0], [3, 4]]))
# [END earthengine__apidocs__ee_array_first_nonzero]