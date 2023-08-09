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

# [START earthengine__apidocs__ee_image_arrayargmax]
# A function to print the array for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# Create a 1D array image.
array_img_1d = ee.Image([0, 1, 5, 2, 3, 4]).toArray()
print('1D array image (pixel):', samp_arr_img(array_img_1d).getInfo())
# [0, 1, 5, 2, 3, 4]

# Get the position of the maximum value in a 1D array.
max_value_1d = array_img_1d.arrayArgmax()
print(
    'Position of the maximum 1D array value:',
    samp_arr_img(max_value_1d).getInfo()
    )
# [2]

# Create a 2D 2x3 array image (reshape the 1D array image).
array_img_2d = array_img_1d.arrayReshape(ee.Image([2, 3]).toArray(), 2)
print('2D 2x3 array image (pixel):', samp_arr_img(array_img_2d).getInfo())
# [[0, 1, 5],
#  [2, 3, 4]]

# Get the position of the maximum value in a 2D array.
max_value_2d = array_img_2d.arrayArgmax()
print(
    'Position of the maximum 2D array value:',
    samp_arr_img(max_value_2d).getInfo()
)
# [0, 2]
# [END earthengine__apidocs__ee_image_arrayargmax]
