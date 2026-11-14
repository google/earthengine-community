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

# [START earthengine__apidocs__ee_list_cat]
display(ee.List(['dog']).cat(['squirrel']))  # ['dog', 'squirrel']

# ['moose', '&', 'squirrel']
display(ee.List(['moose']).cat(['&', 'squirrel']))

# [['a', 'b'], ['1', 1]]
display(ee.List([['a', 'b']]).cat(ee.List([['1', 1]])))

display(ee.List([]).cat(ee.List([])))  # []
display(ee.List([1]).cat(ee.List([])))  # [1]
display(ee.List([]).cat(ee.List([2])))  # [2]
# [END earthengine__apidocs__ee_list_cat]
