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

# [START earthengine__apidocs__ee_number_tan]
import math

# Input angle in radians.
print('Tangent of 0:', ee.Number(0).tan().getInfo())  # 0
print('Tangent of π/2:',
      ee.Number(math.pi/2).tan().getInfo())  # 16331239353195370
print('Tangent of π:', ee.Number(math.pi).tan().getInfo())  # 0 (nearly)

# Convert degrees to radians.
degrees = 45
radians = degrees * (math.pi/180)
print('Tangent of 45 degrees:',
      ee.Number(radians).tan().getInfo())  # 1 (nearly)
# [END earthengine__apidocs__ee_number_tan]
