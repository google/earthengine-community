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

# [START earthengine__apidocs__ee_image_arrayreduce]
# A function to print arrays for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# Create a 1D array image with length 6.
array_img_1d = ee.Image([0, 1, 2, 3, 4, 5]).toArray()
print('1D array image (pixel):', samp_arr_img(array_img_1d).getInfo())
# [0, 1, 2, 3, 4, 5]

# Sum the elements in the 1D array image.
array_img_1d_sum = array_img_1d.arrayReduce(ee.Reducer.sum(), [0])
print('1D array image sum (pixel):', samp_arr_img(array_img_1d_sum).getInfo())
# [15]

# Create a 2D array image with 2 rows and 3 columns.
array_img_2d = array_img_1d.arrayReshape(ee.Image([2, 3]).toArray(), 2)
print('2D array image (pixel):', samp_arr_img(array_img_2d).getInfo())
# [[0, 1, 2],
#  [3, 4, 5]]

# Sum 2D array image along 0-axis.
array_img_2d_sum_row = array_img_2d.arrayReduce(ee.Reducer.sum(), [0])
print(
    '2D array image sum rows (pixel):',
    samp_arr_img(array_img_2d_sum_row).getInfo()
)
# [[3, 5, 7]]

# Sum 2D array image along 1-axis.
array_img_2d_sum_col = array_img_2d.arrayReduce(ee.Reducer.sum(), [1])
print(
    '2D array image sum columns (pixel):',
    samp_arr_img(array_img_2d_sum_col).getInfo()
)
# [[3],
#  [12]]

# Sum 2D array image 0-axis and 1-axis.
array_img_2d_sum_row_col = array_img_2d.arrayReduce(ee.Reducer.sum(), [0, 1])
print(
    '2D array image sum columns (pixel):',
    samp_arr_img(array_img_2d_sum_row_col).getInfo()
)
# [[15]]

# For reducers that provide several outputs (like minMax and percentile),
# you need to ensure you have a dimension to hold the results. For instance,
# if you want minMax for a 1D array, add a second dimension.
array_img_1d_to_2d = array_img_1d.toArray(1)
print('1D array image to 2D:', samp_arr_img(array_img_1d_to_2d).getInfo())
# [[0],
#  [1],
#  [2],
#  [3],
#  [4],
#  [5]]

# Calculate min and max for 2D array, use the fieldAxis parameter.
min_max_1d = array_img_1d_to_2d.arrayReduce(ee.Reducer.minMax(), [0], 1)
print('1D array image minMax (pixel):', samp_arr_img(min_max_1d).getInfo())
# [[0, 5]]

# If your array image is 2D and you want min and max, add a third dimension.
array_img_2d_to_3d = array_img_2d.toArray(2)
print('2D array image to 3D:', samp_arr_img(array_img_2d_to_3d).getInfo())
# [[[0], [1], [2]],
#  [[3], [4], [5]]]

# Calculate min and max along the 0-axis, store results in 2-axis.
min_max_2d = array_img_2d_to_3d.arrayReduce(ee.Reducer.minMax(), [0], 2)
print('2D array image minMax (pixel):', samp_arr_img(min_max_2d).getInfo())
# [[[0, 3],
#   [1, 4],
#   [2, 5]]]
# [END earthengine__apidocs__ee_image_arrayreduce]
