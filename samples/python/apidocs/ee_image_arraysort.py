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

# [START earthengine__apidocs__ee_image_arraysort]
# A function to print arrays for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# Create a 1D array image with length 12.
array_img_1d = ee.Image([0, 10, 6, 5, 4, 7, 11, 1, 2, 9, 8, 3]).toArray()
print('1D array image (pixel):', samp_arr_img(array_img_1d).getInfo())
# [0, 10, 6, 5, 4, 7, 11, 1, 2, 9, 8, 3]

# Sort the 1D array in ascending order.
array_img_1d_sorted = array_img_1d.arraySort()
print('1D array image sorted (pixel):',
      samp_arr_img(array_img_1d_sorted).getInfo())
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

# You can use another array image to control sorting. The order of values
# in the optional keys array translates to relative position in the input
# array. For example, here is a keys array image with non-sequential values in
# descending order, it will reverse the order of the input array; make the
# last position first and the first position last.
keys_1d = ee.Image([99, 98, 50, 45, 23, 18, 9, 8, 7, 5, 2, 0]).toArray()
print('1D array image keys (pixel):', samp_arr_img(keys_1d).getInfo())
# [99, 98, 50, 45, 23, 18, 9, 8, 7, 5, 2, 0]
array_img_1d_sorted_keys = array_img_1d.arraySort(keys_1d)
print('1D array image sorted by keys (pixel):',
      samp_arr_img(array_img_1d_sorted_keys).getInfo())
# [3, 8, 9, 2, 1, 11, 7, 4, 5, 6, 10, 0]

# To sort a 2D array, the keys array image is required.
# Create a 2D array image with 3 rows and 4 columns.
array_img_2d = array_img_1d.arrayReshape(ee.Image([3, 4]).toArray(), 2)
print('2D array image (pixel):', samp_arr_img(array_img_2d).getInfo())
# [[0, 10,  6, 5],
#  [4,  7, 11, 1],
#  [2,  9,  8, 3]]

# Only a single axis can be sorted at a time. Here, we reverse sort along rows.
# There are 4 elements in each row, so we construct an 1x4 array image.
keys_2d_rows = ee.Image([3, 2, 1, 0]).toArray().toArray(1).arrayTranspose()
print('2D array image row keys (pixel):', samp_arr_img(keys_2d_rows).getInfo())
# [[3, 2, 1, 0]]
array_img_2d_sorted_rows = array_img_2d.arraySort(keys_2d_rows)
print('2D array image sorted rows (pixel):',
      samp_arr_img(array_img_2d_sorted_rows).getInfo())
# [[5,  6, 10, 0],
#  [1, 11,  7, 4],
#  [3,  8,  9, 2]]

# Reverse sort along columns, create a 3x1 keys array image with values in
# descending order.
keys_2d_cols = ee.Image([2, 1, 0]).toArray().toArray(1)
print('2D array image column keys (pixel):',
      samp_arr_img(keys_2d_cols).getInfo())
# [[2],
#  [1],
#  [0]]
array_img_2d_sorted_cols = array_img_2d.arraySort(keys_2d_cols)
print('2D array image sorted cols (pixel):',
      samp_arr_img(array_img_2d_sorted_cols).getInfo())
# [[2,  9,  8, 3],
#  [4,  7, 11, 1],
#  [0, 10,  6, 5]]
# [END earthengine__apidocs__ee_image_arraysort]
