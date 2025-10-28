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

# [START earthengine__apidocs__ee_number_trigamma]
display('Trigamma for -100:', ee.Number(-100).trigamma())  # Infinity

# 1000001.642533195
display('Trigamma for 0.001:', ee.Number(0.001).trigamma())
display('Trigamma for 0.5:', ee.Number(0.5).trigamma())  # 4.934802200
display('Trigamma for 1:', ee.Number(1).trigamma())  # 1.644934066
display('Trigamma for 100:', ee.Number(100).trigamma())  # 0.010050166
display('Trigamma for 200:', ee.Number(200).trigamma())  # 0.005012520
# [END earthengine__apidocs__ee_number_trigamma]
