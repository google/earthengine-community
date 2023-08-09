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

# [START earthengine__apidocs__ee_image_arrayget]
# A function to print the array for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# Create a 1D array image.
array_img_1d = ee.Image([0, 1, 2, 3, 4, 5]).toArray()
print('1D array image (pixel):', samp_arr_img(array_img_1d).getInfo())
# [0, 1, 2, 3, 4, 5]

# Get the array value at a given position. Here we target the 4th element.
position_1d = ee.Image([3])
selected_element_1d = array_img_1d.arrayGet(position_1d)
print(
    'Element at position [3] (4th element):',
    samp_arr_img(selected_element_1d).getInfo()
)
# [3]

# Create a 2D 2x3 array image (reshape the 1D array image).
array_img_2d = array_img_1d.arrayReshape(ee.Image([2, 3]).toArray(), 2)
print('2D 2x3 array image (pixel):', samp_arr_img(array_img_2d).getInfo())
# [[0, 1, 2],
#  [3, 4, 5]]

# Get the array element value at axis-0, position 0 and axis-1, position 2.
position_2d = ee.Image([0, 2])
selected_element_2d = array_img_2d.arrayGet(position_2d)
print(
    'Element at position [0, 2]:',
    samp_arr_img(selected_element_2d).getInfo()
)
# 2
# [END earthengine__apidocs__ee_image_arrayget]
