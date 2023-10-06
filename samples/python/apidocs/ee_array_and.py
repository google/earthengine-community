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

# [START earthengine__apidocs__ee_array_and]
# Element-wise boolean "and" operator.
# Both arrays must be the same dimensions.
array_neither = ee.Array([0, 0])
array_first = ee.Array([1, 0])
array_second = ee.Array([0, 1])
array_both = ee.Array([1, 1])
# Any non-zero value is true.
array_larger = ee.Array([-2, 2])

display(array_both.And(array_larger))  # [1, 1]
display(array_both.And(array_neither))  # [0, 0]

display(array_first.And(array_second))  # [0, 0]
display(array_second.And(array_first))  # [0, 0]

display(array_both.And(array_first))  # [1, 0]
display(array_both.And(array_second))  # [0, 1]

display(array_neither.And(array_first))  # [0, 0]
display(array_neither.And(array_second))  # [0, 0]

# Works the same for all PixelTypes.
array_double = ee.Array([0.0, 2.0], ee.PixelType.double())
display(array_both.And(array_double))  # [0, 1]
# [END earthengine__apidocs__ee_array_and]
