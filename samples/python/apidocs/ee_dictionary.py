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

# [START earthengine__apidocs__ee_dictionary]
# A dictionary input (e.g. results of ee.Image.reduceRegion of an S2 image).
dic = {
    'B1': 182,
    'B2': 219,
    'B3': 443
}
print('ee.Dictionary from dictionary input:', ee.Dictionary(dic).getInfo())

# A list of key/value pairs (from previous dictionary).
lst = [
    'B1', 182,
    'B2', 219,
    'B3', 443
]
print('ee.Dictionary from list input', ee.Dictionary(lst).getInfo())
# [END earthengine__apidocs__ee_dictionary]
