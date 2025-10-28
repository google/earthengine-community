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

# [START earthengine__apidocs__ee_string_match]
s = ee.String('ABCabc123')
display(s.match(''))  # ""
display(s.match('ab', 'g'))  # ab
display(s.match('ab', 'i'))  # AB
display(s.match('AB', 'ig'))  # ['AB','ab']
display(s.match('[a-z]+[0-9]+'))  # 'abc123'
display(s.match('\\d{2}'))  # '12'

# Use [^] to match any character except a digit.
display(s.match('abc[^0-9]', 'i'))  # ['ABCa']
# [END earthengine__apidocs__ee_string_match]
