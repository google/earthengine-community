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
display(ee.PixelType('int', 0, 1))  # int ∈ [0, 1]
display(ee.PixelType('int', -20, -10))  # int ∈ [-20, -10]
display(ee.PixelType('float'))  # float
display(ee.PixelType('double'))  # double
display(ee.PixelType('double', None))  # double
display(ee.PixelType('double', None, None))  # double
display(ee.PixelType('double', None, None, 0))  # double
display(ee.PixelType('double', None, None, 1))  # double, 1 dimensions
display(ee.PixelType('double', None, None, 2))  # double, 2 dimensions
display(ee.PixelType('double', None, None, 3))  # double, 3 dimensions
display(ee.PixelType('double', None, None, 10))  # double, 10 dimensions

# double, 100000000 dimensions
display(ee.PixelType('double', None, None, 1e8))

display(ee.PixelType('double', 1, 2, 0))  # double ∈ [1, 2]

# double ∈ [1, 3], 2 dimensions
display(ee.PixelType('double', 1, 3, 2))
display(ee.PixelType('double', -4, -3, 0))  # double ∈ [-4, -3]

display(ee.PixelType('double', None, 2.3, 0))  # double
display(ee.PixelType('double', 3.4, None, 0))  # double
# [END earthengine__apidocs__ee_pixeltype]
