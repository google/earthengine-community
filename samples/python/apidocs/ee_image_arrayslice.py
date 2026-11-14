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

# [START earthengine__apidocs__ee_image_arrayslice]
# A function to print arrays for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# Create a 1D array image with length 12.
array_img_1d = ee.Image([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).toArray()
display('1D array image (pixel):', samp_arr_img(array_img_1d))
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

# Get the first 3 elements.
display('1D array image first 3 elements (pixel):',
        samp_arr_img(array_img_1d.arraySlice(0, 0, 3)))
# [0, 1, 2]

# Get the last 3 elements.
display('1D array image last 3 elements (pixel):',
        samp_arr_img(array_img_1d.arraySlice(0, -3)))
# [9, 10, 11]

# Get elements at index positions 3 through 5 (0-based).
display('1D array image elements at index positions 3 through 5 (pixel):',
        samp_arr_img(array_img_1d.arraySlice(0, 3, 6)))
# [3, 4, 5]

# Get elements at index positions 4 through end (0-based).
display('1D array image elements at index positions 4 through end (pixel)',
        samp_arr_img(array_img_1d.arraySlice(0, 4)))
# [4, 5, 6, 7, 8, 9, 10, 11]

# Get elements using a step of 3.
display('1D array image elements at a step of 3 (pixel)',
        samp_arr_img(array_img_1d.arraySlice(0, 0, None, 3)))
# [0, 3, 6, 9]

# Create a 2D array image with 3 rows and 4 columns.
array_img_2d = array_img_1d.arrayReshape(ee.Image([3, 4]).toArray(), 2)
display('2D array image (pixel)', samp_arr_img(array_img_2d))
# [[0, 1,  2,  3],
#  [4, 5,  6,  7],
#  [8, 9, 10, 11]]

# Get the second row.
display('2D array image second row (pixel):',
        samp_arr_img(array_img_2d.arraySlice(0, 1, 2)))
# [[4, 5, 6, 7]

# Get the second column.
display('2D array image second column (pixel):',
        samp_arr_img(array_img_2d.arraySlice(1, 1, 2)))
# [[1],
#  [5],
#  [9]]

# Get all columns except the last.
display('2D array image all columns except last (pixel):',
        samp_arr_img(array_img_2d.arraySlice(1, 0, -1)))
# [[0, 1,  2],
#  [4, 5,  6],
#  [8, 9, 10]]
# [END earthengine__apidocs__ee_image_arrayslice]
