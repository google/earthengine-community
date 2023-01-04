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

# [START earthengine__apidocs__ee_number_cos]
import math

# Input angle in radians.
print('Cosine of 0:', ee.Number(0).cos().getInfo())  # 1
print('Cosine of π/2:', ee.Number(math.pi/2).cos().getInfo())  # 0 (nearly)
print('Cosine of π:', ee.Number(math.pi).cos().getInfo())  # -1

# Convert degrees to radians.
degrees = 45
radians = degrees * (math.pi/180)
# 0.707106781
print('Cosine of 45 degrees:', ee.Number(radians).cos().getInfo())
# [END earthengine__apidocs__ee_number_cos]
