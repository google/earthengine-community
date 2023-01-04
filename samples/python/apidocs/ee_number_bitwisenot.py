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

# [START earthengine__apidocs__ee_number_bitwisenot]
"""Unsigned 8-bit type example.

25 as binary:    00011001
Flip each digit: 11100110

11100110 is signed 8-bit binary for -26.
(binary interpreted using smallest signed integer type containing the input).
"""

print(ee.Number(25).bitwiseNot().getInfo())
# [END earthengine__apidocs__ee_number_bitwisenot]
