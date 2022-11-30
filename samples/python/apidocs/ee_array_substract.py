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

# [START earthengine__apidocs__ee_array_subtract]
print(ee.Array([10]).subtract(1).getInfo())  # [9]

print(ee.Array([-1, 0, 1]).subtract(2).getInfo())  # [-3, -2, -1]
print(ee.Array([-1, 0, 1]).subtract([-5, 6, 7]).getInfo())  # [4, -6, -6]

empty = ee.Array([], ee.PixelType.int8())
print(empty.subtract(empty).getInfo())  # []
# [END earthengine__apidocs__ee_array_subtract]