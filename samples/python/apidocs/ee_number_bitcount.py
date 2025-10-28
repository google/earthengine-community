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
display(ee.Number(0).bitCount())       # [0]
display(ee.Number(1).bitCount())       # [1]
display(ee.Number(2).bitCount())       # [1]
display(ee.Number(3).bitCount())       # [2]
display(ee.Number(0xFFFF).bitCount())  # [16]

# https://en.wikipedia.org/wiki/Two's_complement signed values.
display(ee.Number(-1).bitCount())                       # [64]
display(ee.Number(-1).toInt8().bitCount())              # [64]
display(ee.Number(-2).bitCount())                       # [63]
# [END earthengine__apidocs__ee_number_bitcount]
