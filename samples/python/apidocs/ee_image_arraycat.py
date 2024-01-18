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

# [START earthengine__apidocs__ee_image_arraycat]
# A function to print arrays for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# Create two 1D array images.
array_img_1d_a = ee.Image([0, 1, 2]).toArray()
print('1D array image (A) (pixel):', samp_arr_img(array_img_1d_a).getInfo())
# [0, 1, 2]
array_img_1d_b = ee.Image([3, 4, 5]).toArray()
print('1D array image (B) (pixel):', samp_arr_img(array_img_1d_b).getInfo())
# [3, 4, 5]

# Concatenate 1D array image B to 1D array image A on 0-axis (rows).
array_img_1d_cat_ax0 = array_img_1d_a.arrayCat(array_img_1d_b, 0)
print(
    'Concatenate 1D array images on 0-axis:',
    samp_arr_img(array_img_1d_cat_ax0).getInfo()
)
# [0, 1, 2, 3, 4, 5]

# Concatenate 1D array image B to 1D array image A on 1-axis (columns).
array_img_1d_cat_ax1 = array_img_1d_a.arrayCat(array_img_1d_b, 1)
print(
    'Concatenate 1D array images on 1-axis:',
    samp_arr_img(array_img_1d_cat_ax1).getInfo()
)
# [[0, 3],
#  [1, 4]
#  [2, 5]]

# Create two 2D array images (expand the dimensions of 1D arrays).
array_img_2d_a = array_img_1d_a.toArray(1)
print('2D array image (A) (pixel):', samp_arr_img(array_img_2d_a).getInfo())
# [[0],
#  [1],
#  [2]]
array_img_2d_b = array_img_1d_b.toArray(1)
print('2D array image (B) (pixel):', samp_arr_img(array_img_2d_b).getInfo())
# [[3],
#  [4],
#  [5]]

# Concatenate 2D array image B to 2D array image A on 0-axis (rows).
array_img_2d_cat_ax0 = array_img_2d_a.arrayCat(array_img_2d_b, 0)
print(
    'Concatenate 2D array images on 0-axis:',
    samp_arr_img(array_img_2d_cat_ax0).getInfo()
)
# [[0],
#  [1],
#  [2],
#  [3],
#  [4],
#  [5]]

# Concatenate 2D array image B to 2D array image A on 1-axis (columns).
array_img_2d_cat_ax1 = array_img_2d_a.arrayCat(array_img_2d_b, 1)
print(
    'Concatenate 2D array images on 1-axis:',
    samp_arr_img(array_img_2d_cat_ax1).getInfo()
)
# [[0, 3],
#  [1, 4],
#  [2, 5]]
# [END earthengine__apidocs__ee_image_arraycat]
