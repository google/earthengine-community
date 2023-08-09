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

# [START earthengine__apidocs__ee_image_arraypad]
# A function to print the array for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# Create a 1D array image.
array_img_1d = ee.Image([0, 1, 2]).toArray()
print('1D array image (pixel):', samp_arr_img(array_img_1d).getInfo())
# [0, 1, 2]

# Pad 1D array to length of 5 with value 9.
array_img_1d_pad = array_img_1d.arrayPad([5], 9)
print('1D array image padded:', samp_arr_img(array_img_1d_pad).getInfo())
# [0, 1, 2, 9, 9]

# Create a 2D array image.
array_img_2d = ee.Image([0, 1, 2, 3, 4, 5]).toArray().arrayReshape(
    ee.Image([2, 3]).toArray(),
    2
)
print('2D 2x3 array image (pixel):', samp_arr_img(array_img_2d).getInfo())
# [[0, 1, 2],
#  [3, 4, 5]]

# Pad 2D array to 0-axis length 3 and 1-axis length 5 with value 9.
array_img_2d_pad = array_img_2d.arrayPad([3, 5], 9)
print('2D array image padded:', samp_arr_img(array_img_2d_pad).getInfo())
# [[0, 1, 2, 9, 9],
#  [3, 4, 5, 9, 9],
#  [9, 9, 9, 9, 9]]
# [END earthengine__apidocs__ee_image_arraypad]
