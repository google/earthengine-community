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

# [START earthengine__apidocs__ee_number_atan2]
print('Atan2 of point (0,0):', ee.Number(0).atan2(0).getInfo())  # 0
print('Atan2 of point (1,0):', ee.Number(1).atan2(0).getInfo())  # 0
# 1.570796326 (π/2)
print('Atan2 of point (0,1):', ee.Number(0).atan2(1).getInfo())
# 3.141592653 (π)
print('Atan2 of point (-1,0):', ee.Number(-1).atan2(0).getInfo())
# -1.570796326 (-π/2)
print('Atan2 of point (0,-1):', ee.Number(0).atan2(-1).getInfo())
# [END earthengine__apidocs__ee_number_atan2]
