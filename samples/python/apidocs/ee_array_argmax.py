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

# [START earthengine__apidocs__ee_array_argmax]
# Return the position of the maximum value in each dimension.

# Returns null if the array is empty.
display(ee.Array([], ee.PixelType.int8()).argmax())  # None

display(ee.Array([9]).argmax())  # [0]
display(ee.Array([0, -1, 2, 1]).argmax())  # [2]
display(ee.Array([[3, 4, 2], [6, 5, 7]]).argmax())  # [1, 2]

# Returns the first occurrence of the maximum.
display(ee.Array([1, 1, 1, 9, 9, 9]).argmax())  # [3]
# [END earthengine__apidocs__ee_array_argmax]
