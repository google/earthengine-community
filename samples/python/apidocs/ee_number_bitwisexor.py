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

# [START earthengine__apidocs__ee_number_bitwisexor]
"""Unsigned 8-bit type example.

25 as binary:         00011001
21 as binary:         00010101
Only one digit is 1?: 00001100

00001100 is unsigned 8-bit binary for 12.
"""

print(ee.Number(25).bitwiseXor(21).getInfo())
# [END earthengine__apidocs__ee_number_bitwisexor]
