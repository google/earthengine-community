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

# [START earthengine__apidocs__ee_array_get]
display(ee.Array([9]).get([0]))  # 9
display(ee.Array([8, 7, 6]).get([2]))  # 6

array = ee.Array([[0, 1, 2], [3, 4, 5]])
display(array.get([0, 0]))  # 0
display(array.get([0, 1]))  # 1
display(array.get([1, 0]))  # 3
display(array.get([1, 2]))  # 5
# [END earthengine__apidocs__ee_array_get]