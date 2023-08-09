# Copyright 2023 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_pixeltype]
print(ee.PixelType('int', 0, 1).getInfo())  # int ∈ [0, 1]
print(ee.PixelType('int', -20, -10).getInfo())  # int ∈ [-20, -10]
print(ee.PixelType('float').getInfo())  # float
print(ee.PixelType('double').getInfo())  # double
print(ee.PixelType('double', None).getInfo())  # double
print(ee.PixelType('double', None, None).getInfo())  # double
print(ee.PixelType('double', None, None, 0).getInfo())  # double
print(ee.PixelType('double', None, None, 1).getInfo())  # double, 1 dimensions
print(ee.PixelType('double', None, None, 2).getInfo())  # double, 2 dimensions
print(ee.PixelType('double', None, None, 3).getInfo())  # double, 3 dimensions
print(ee.PixelType('double', None, None, 10).getInfo())  # double, 10 dimensions

# double, 100000000 dimensions
print(ee.PixelType('double', None, None, 1e8).getInfo())

print(ee.PixelType('double', 1, 2, 0).getInfo())  # double ∈ [1, 2]

# double ∈ [1, 3], 2 dimensions
print(ee.PixelType('double', 1, 3, 2).getInfo())
print(ee.PixelType('double', -4, -3, 0).getInfo())  # double ∈ [-4, -3]

print(ee.PixelType('double', None, 2.3, 0).getInfo())  # double
print(ee.PixelType('double', 3.4, None, 0).getInfo())  # double
# [END earthengine__apidocs__ee_pixeltype]
