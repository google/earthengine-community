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

# [START earthengine__apidocs__ee_array_pow]
empty = ee.Array([], ee.PixelType.int8())
display(empty.pow(empty))  # []

# [0.25, -0.5, 1, -2, 4, -8]
display(ee.Array([-2, -2, -2, -2, -2, -2]).pow([-2, -1, 0, 1, 2, 3]))

# [1, -1, 1, -1, 1, -1]
display(ee.Array([-1, -1, -1, -1, -1, -1]).pow([-2, -1, 0, 1, 2, 3]))

# ['Infinity', 'Infinity', 1, 0, 0, 0]
display(ee.Array([0, 0, 0, 0, 0, 0]).pow([-2, -1, 0, 1, 2, 3]))

# [1, 0, 0, 0]
display(ee.Array([0, 0, 0, 0]).pow([0, 1, 2, 3]))

# [1, 1, 1, 1, 1, 1]
display(ee.Array([1, 1, 1, 1, 1, 1]).pow([-2, -1, 0, 1, 2, 3]))

# [0.25, 0.5, 1, 2, 4, 8]
display(ee.Array([2, 2, 2, 2, 2, 2]).pow([-2, -1, 0, 1, 2, 3]))

# [0.009999999776482582,
#  0.10000000149011612,
#  1,
#  10,
#  100,
#  1000]
display(ee.Array([10, 10, 10, 10, 10, 10]).pow([-2, -1, 0, 1, 2, 3]))

# [0.009999999776482582,
#  0.10000000149011612,
#  1,
#  10,
#  100,
#  1000]
display(ee.Array([10, 10, 10, 10, 10, 10], ee.PixelType.int32())
        .pow([-2, -1, 0, 1, 2, 3]))
# [END earthengine__apidocs__ee_array_pow]