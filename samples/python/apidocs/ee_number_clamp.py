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

# [START earthengine__apidocs__ee_number_clamp]
# Numbers within range are unaffected.
# 100
print('100 clamped to range [0,255]:', ee.Number(100).clamp(0, 255).getInfo())

# Numbers greater than max in range are set to max.
# 255
print('259 clamped to range [0,255]:', ee.Number(259).clamp(0, 255).getInfo())

# Numbers less than min in range are set to min.
# 0
print('-259 clamped to range [0,255]:', ee.Number(-259).clamp(0, 255).getInfo())
# [END earthengine__apidocs__ee_number_clamp]
