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

# [START earthengine__apidocs__ee_string_getinfo]
# After getInfo(), the instance is a local Python string.
# Regular Python string manipulations are then available.

# Note: getInfo() fetches results from Earth Engine synchronously;
# later expressions will not be evaluated until it completes.

print(ee.String('abc').getInfo()[-2])  # b
print(ee.String('abc').getInfo()[2])  # c

# Fetch string using getInfo
print(ee.String('abc').getInfo() + 'def')  # abcdef
# [END earthengine__apidocs__ee_string_getinfo]
