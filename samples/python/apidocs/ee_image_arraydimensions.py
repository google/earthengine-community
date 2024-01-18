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

# [START earthengine__apidocs__ee_image_arraydimensions]
# A function to print arrays for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# A 3-band image of constants.
img = ee.Image([0, 1, 2])
print('3-band image:', img.getInfo())

# Convert the 3-band image to a 2D array image.
array_img_2d = img.toArray().toArray(1)
print('2D array image (pixel):', samp_arr_img(array_img_2d).getInfo())
# [[0],
#  [1],
#  [2]]

# Get the number of dimensions in each pixel's array.
array_img_2d_dim = array_img_2d.arrayDimensions()
print('N dimensions in array:', samp_arr_img(array_img_2d_dim).getInfo())
# 2

# Get the array length per dimension per pixel.
array_img_2d_dim_len = array_img_2d.arrayLengths()
print(
    'Array length per dimension:',
    samp_arr_img(array_img_2d_dim_len).getInfo()
)
# [3, 1]

# Get the array length for 0-axis (rows).
array_img_2d_axis0_len = array_img_2d.arrayLength(0)
print(
    'Array length 0-axis (rows):',
    samp_arr_img(array_img_2d_axis0_len).getInfo()
)
# 3

# Get the array length for 1-axis (columns).
array_img_2d_axis1_len = array_img_2d.arrayLength(1)
print(
    'Array length 1-axis (columns):',
    samp_arr_img(array_img_2d_axis1_len).getInfo()
)
# 1
# [END earthengine__apidocs__ee_image_arraydimensions]
