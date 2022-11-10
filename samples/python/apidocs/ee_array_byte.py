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

# [START earthengine__apidocs__ee_array_byte]
# Clamps below at 0.
print(ee.Array([-1]).byte().getInfo())  # [0]
print(ee.Array([255]).byte().getInfo())  # [255]
# Clamps above at 255.
print(ee.Array([256]).byte().getInfo())  # [255]

# Rounds. [0, 0, 1, 127, 255, 255]
print(ee.Array([-0.1, 0.1, 0.5, 127.1, 255.1, 255.9]).byte().getInfo())

# Requires an explicit PixelType if no data.
print(ee.Array([[], []], ee.PixelType.float()).byte().getInfo())  # [[], []]
# [END earthengine__apidocs__ee_array_byte]
