# Copyright 2022 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_number_cosh]
import math

# Input angle in radians.
print('Hyperbolic cosine of -5:',
      ee.Number(-5).cosh().getInfo())  # 74.209948524
print('Hyperbolic cosine of -1:', ee.Number(-1).cosh().getInfo())  # 1.543080634
print('Hyperbolic cosine of 0:', ee.Number(0).cosh().getInfo())  # 1
print('Hyperbolic cosine of 1:', ee.Number(1).cosh().getInfo())  # 1.543080634
print('Hyperbolic cosine of 5:', ee.Number(5).cosh().getInfo())  # 74.209948524

# Convert degrees to radians.
degrees = 45
radians = degrees * (math.pi/180)
print('Hyperbolic cosine of 45 degrees:',
      ee.Number(radians).cosh().getInfo())  # 1.324609089
# [END earthengine__apidocs__ee_number_cosh]
