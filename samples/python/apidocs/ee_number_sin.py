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

# [START earthengine__apidocs__ee_number_sin]
import math

# Input angle in radians.
print('Sine of 0:', ee.Number(0).sin().getInfo())  # 0
print('Sine of π/2:', ee.Number(math.pi/2).sin().getInfo())  # 1
print('Sine of 3π/2:', ee.Number(3*math.pi/2).sin().getInfo())  # -1

# Convert degrees to radians.
degrees = 45
radians = degrees * (math.pi/180)
print('Sine of 45 degrees:', ee.Number(radians).sin().getInfo())  # 0.707106781
# [END earthengine__apidocs__ee_number_sin]
