# Copyright 2024 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


#  Earth Engine Developer's Guide examples
#   from 'Arrays - Arrays and Array Images' section

# [START earthengine__arrays02__toy_arrays]
array_1d = ee.Array([1, 2, 3])  # [1,2,3]
array_2d = ee.Array.cat([array_1d], 1)  # [[1],[2],[3]]
# [END earthengine__arrays02__toy_arrays]

display(
    'Arrays:',
    {'1-D array': array_1d.getInfo(), '2-D array': array_2d.getInfo()},
)
