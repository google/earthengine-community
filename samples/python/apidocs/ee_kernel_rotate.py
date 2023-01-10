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

# [START earthengine__apidocs__ee_kernel_rotate]
from pprint import pprint

# A kernel to be rotated.
sobel_kernel = ee.Kernel.sobel()
pprint(sobel_kernel.getInfo())

#  Output weights matrix

#  [-1, 0, 1]
#  [-2, 0, 2]
#  [-1, 0, 1]

print('One 90 degree clockwise rotation:')
pprint(sobel_kernel.rotate(1).getInfo())

#  [-1, -2, -1]
#  [ 0,  0,  0]
#  [ 1,  2,  1]

print('Two 90 degree counterclockwise rotations:')
pprint(sobel_kernel.rotate(-2).getInfo())

#  [1, 0, -1]
#  [2, 0, -2]
#  [1, 0, -1]
# [END earthengine__apidocs__ee_kernel_rotate]
