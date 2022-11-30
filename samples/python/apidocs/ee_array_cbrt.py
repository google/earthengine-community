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

# [START earthengine__apidocs__ee_array_cbrt]
# Requires an explicit PixelType if no data.
print(ee.Array([], ee.PixelType.int8()).cbrt().getInfo())  # []

print(ee.Array([0]).cbrt().getInfo())  # [0]
print(ee.Array([27]).cbrt().getInfo())  # [3]
print(ee.Array([-27]).cbrt().getInfo())  # -3

print(ee.Array([0, 1, 8, 27]).cbrt().getInfo())  # [0, 1, 2, 3]

# [[0, 1, 2], [3, 4, 5]]
print(ee.Array([[0, 1, 8], [27, 64, 125]]).cbrt().getInfo())
# [END earthengine__apidocs__ee_array_cbrt]