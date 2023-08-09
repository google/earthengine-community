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

# [START earthengine__apidocs__ee_image_arraydotproduct]
# A function to print arrays for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# A 1D array image.
array_img_1d_a = ee.Image([0, 1, 2]).toArray()
print('1D array image A (pixel):', samp_arr_img(array_img_1d_a).getInfo())
# [0, 1, 2]

# A second 1D array image of the same length.
array_img_1d_b = ee.Image([3, 4, 5]).toArray()
print('1D array image B (pixel):', samp_arr_img(array_img_1d_b).getInfo())
# [3, 4, 5]

# Calculate the dot product for the two 1D arrays.
test = array_img_1d_a.arrayDotProduct(array_img_1d_b)
print('A⋅B = 0(3) + 1(4) + 2(5) = ', samp_arr_img(test).getInfo())
# 14
# [END earthengine__apidocs__ee_image_arraydotproduct]
