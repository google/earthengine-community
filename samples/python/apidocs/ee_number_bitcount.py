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

# [START earthengine__apidocs__ee_number_bitcount]
print(ee.Number(0).bitCount().getInfo())       # [0]
print(ee.Number(1).bitCount().getInfo())       # [1]
print(ee.Number(2).bitCount().getInfo())       # [1]
print(ee.Number(3).bitCount().getInfo())       # [2]
print(ee.Number(0xFFFF).bitCount().getInfo())  # [16]

# https://en.wikipedia.org/wiki/Two's_complement signed values.
print(ee.Number(-1).bitCount().getInfo())                       # [64]
print(ee.Number(-1).toInt8().bitCount().getInfo())              # [64]
print(ee.Number(-2).bitCount().getInfo())                       # [63]
# [END earthengine__apidocs__ee_number_bitcount]
