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

# [START earthengine__apidocs__ee_number_tanh]
import math

# Input angle in radians.
print('Hyperbolic tangent of -5:',
      ee.Number(-5).tanh().getInfo())  # -0.999909204
print('Hyperbolic tangent of -1:',
      ee.Number(-1).tanh().getInfo())  # -0.761594155
print('Hyperbolic tangent of 0:', ee.Number(0).tanh().getInfo())  # 0
print('Hyperbolic tangent of 1:', ee.Number(1).tanh().getInfo())  # 0.761594155
print('Hyperbolic tangent of 5:', ee.Number(5).tanh().getInfo())  # 0.999909204

# Convert degrees to radians.
degrees = 45
radians = degrees * (math.pi/180)
print('Hyperbolic tangent of 45 degrees:',
      ee.Number(radians).tanh().getInfo())  # 0.655794202
# [END earthengine__apidocs__ee_number_tanh]
