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

# [START earthengine__apidocs__ee_algorithms_if]
# The string "*false*"
print(ee.Algorithms.If(False, '*true*', '*false*').getInfo())

# The string "*true*"
print(ee.Algorithms.If(True, '*true*', '*false*').getInfo())

# Consider using remap rather than If for tasks like numbers for classes.
print(ee.Algorithms.If(ee.String('Tree').compareTo('Tree'), 0, 1).getInfo())
print(ee.Algorithms.If(ee.String('NotTree').compareTo('Tree'), 0, 1).getInfo())
# [END earthengine__apidocs__ee_algorithms_if]
