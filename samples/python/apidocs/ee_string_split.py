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

# [START earthengine__apidocs__ee_string_split]
s = ee.String('aBAbcD')
print(s.split('Ab').getInfo())  # ['aB', 'cD']
# 'i' tells split to ignore case.
print(s.split('ab', 'i').getInfo())  # ['', '', 'cD']
# Split on 'b' or 'c'
print(s.split('[bc]', 'i').getInfo())  # ['a', 'A', '', 'D']
# Split on 'BA' or 'c'
print(s.split('(BA|c)').getInfo())  # ['a', 'b', 'D']

s = ee.String('a,b,cdee f,g')
# ['a', ',', 'b', ',', 'c', 'd', 'e', 'e', ' ', 'f', ',', 'g']
print(s.split('').getInfo())

print(s.split(' ').getInfo())  # ['a,b,cdee', 'f,g']
print(s.split('[[:space:]]').getInfo())  # ['a,b,cdee', 'f,g']

print(s.split(',').getInfo())  # ['a', 'b', 'cdee f', 'g']

print(s.split('ee').getInfo())  # ['a,b,cd', ' f,g']

# Split on any lower case letter.
print(s.split('[a-z]').getInfo())  # ['', ',', ',', '', '', '', ' ', ',']

# ^ as the first character in [] excludes.
print(s.split('[^a-z]').getInfo())  # ['a', 'b', 'cdee', 'f', 'g']

# Splitting on characters that are special to split.
s = ee.String('a.b*c?d')
print(s.split('\\.').getInfo())  # ['a', 'b*c?d']
print(s.split('[*]').getInfo())  # ['a.b', 'c?d']
print(s.split('[?]').getInfo())  # ['a.b*c', 'd']
# [END earthengine__apidocs__ee_string_split]
