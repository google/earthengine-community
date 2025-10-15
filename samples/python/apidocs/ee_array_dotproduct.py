# Copyright 2025 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_array_dotproduct]
display(ee.Array([1]).dotProduct(ee.Array([2])).getInfo())  # 2
display(ee.Array([1, 2]).dotProduct(ee.Array([3, 4])).getInfo())  # 1*3 + 2*4 = 11
display(ee.Array([0, 1, 2]).dotProduct(ee.Array([3, 4, 5])).getInfo())  # 0*3 + 1*4 + 2*5 = 14
display(ee.Array([-1, -2]).dotProduct(ee.Array([3, 4])).getInfo())  # -1*3 + -2*4 = -11
display(ee.Array([1.5, 2.5]).dotProduct(ee.Array([3, 4])).getInfo())  # 1.5*3 + 2.5*4 = 14.5
# [END earthengine__apidocs__ee_array_dotproduct]
