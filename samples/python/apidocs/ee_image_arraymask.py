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

# [START earthengine__apidocs__ee_image_arraymask]
# A function to print arrays for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# Create a 1D array image with length 6.
array_img_1d = ee.Image([0, 1, 2, 4, 0, 5]).toArray()
print('1D array image (pixel):', samp_arr_img(array_img_1d).getInfo())
# [0, 1, 2, 4, 0, 5]

# Create a mask using a relational operator to mask values greater than 2.
mask_1d = array_img_1d.lte(2)
print(
    '1D mask for greater than value 2 (pixel):',
    samp_arr_img(mask_1d).getInfo()
)
# [1, 1, 1, 0, 1, 0]

array_img1d_mask = array_img_1d.arrayMask(mask_1d)
print('1D array image mask (pixel):', samp_arr_img(array_img1d_mask).getInfo())
# [0, 1, 2, 0]

# Self mask the 1D array image. Value zero will be masked out.
array_img_1d_self_mask = array_img_1d.arrayMask(array_img_1d)
print(
    '1D array image self mask (pixel):',
    samp_arr_img(array_img_1d_self_mask).getInfo()
)
# [1, 2, 4, 5]

# Create a 2D array image.
array_img_2d = array_img_1d.arrayReshape(ee.Image([2, 3]).toArray(), 2)
print('2D 2x3 array image (pixel):', samp_arr_img(array_img_2d).getInfo())
# [[0, 1, 2],
#  [4, 0, 5]]

# Slice out a row to use as a column mask.
row_as_mask_for_cols = array_img_2d.arraySlice(0, 1, 2)
print('2D mask for cols (pixel):', samp_arr_img(row_as_mask_for_cols).getInfo())
# [[4, 0, 5]]

array_img_2d_mask_cols = array_img_2d.arrayMask(row_as_mask_for_cols);
print(
    '2D array image cols masked (pixel):',
    samp_arr_img(array_img_2d_mask_cols).getInfo()
)
# [[0, 2],
#  [4, 5]]

# Slice out a column to use as a row mask.
col_as_mask_for_rows = array_img_2d.arraySlice(1, 1, 2)
print('2D mask for rows (pixel):', samp_arr_img(col_as_mask_for_rows).getInfo())
# [[1],
#  [0]]

array_img_2d_mask_rows = array_img_2d.arrayMask(col_as_mask_for_rows)
print(
    '2D array image rows masked (pixel):',
    samp_arr_img(array_img_2d_mask_rows).getInfo()
)
# [[0, 1, 2]]
# [END earthengine__apidocs__ee_image_arraymask]
