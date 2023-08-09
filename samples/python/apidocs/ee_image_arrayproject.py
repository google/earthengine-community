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

# [START earthengine__apidocs__ee_image_arrayproject]
# A function to print arrays for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# Create a 2D array image with the 0-axis having length 6 and the 1-axis
# having length 1.
array_img_2d = ee.Image([0, 1, 2, 3, 4, 5]).toArray().toArray(1)
print('2D array image (pixel):', samp_arr_img(array_img_2d).getInfo())
# [[0],
#  [1],
#  [2],
#  [3],
#  [4],
#  [5]]

# Project the 2D array to a 1D array, retain the 0-axis (concatenate elements
# from the 1-axis into the 0-axis).
array_img_2d_to_1d = array_img_2d.arrayProject([0])
print('2D array image (pixel):', samp_arr_img(array_img_2d_to_1d).getInfo())
# [0, 1, 2, 3, 4, 5]
# [END earthengine__apidocs__ee_image_arrayproject]
