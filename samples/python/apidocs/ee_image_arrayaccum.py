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

# [START earthengine__apidocs__ee_image_arrayaccum]
# A function to print the array for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# Create a 1D array image.
array_img_1d = ee.Image([1, 2, 3]).toArray()
print('1D array image (pixel):', samp_arr_img(array_img_1d).getInfo())
# [1, 2, 3]

# Perform accumulation procedures along axes using ee.Reducer functions.
# Here we calculate the cumulative sum along the 0-axis for a 1D array.
accum_sum_1d_ax0 = array_img_1d.arrayAccum(0, ee.Reducer.sum())
print('Cumulative sum along 0-axis:', samp_arr_img(accum_sum_1d_ax0).getInfo())
# [1, 3, 6]

# Create a 2D 3x3 array image.
array_img_2d = ee.Image([1, 2, 3, 4, 5, 6, 7, 8, 9]).toArray().arrayReshape(
    ee.Image([3, 3]).toArray(),
    2)
print('2D 3x3 array image (pixel):', samp_arr_img(array_img_2d).getInfo())
# [[1, 2, 3],
#  [4, 5, 6],
#  [7, 8, 9]]

# Calculate the cumulative sum along the 0-axis for a 2D array.
accum_sum_2d_ax0 = array_img_2d.arrayAccum(0, ee.Reducer.sum())
print('Cumulative sum along 0-axis:', samp_arr_img(accum_sum_2d_ax0).getInfo())
# [[ 1,  2,  3],
#  [ 5,  7,  9],
#  [12, 15, 18]]

# Calculate the cumulative sum along the 1-axis for a 2D array.
accum_sum_2d_ax1 = array_img_2d.arrayAccum(1, ee.Reducer.sum())
print('Cumulative sum along 1-axis:', samp_arr_img(accum_sum_2d_ax1).getInfo())
# [[1,  3,  6],
#  [4,  9, 15],
#  [7, 15, 24]]
# [END earthengine__apidocs__ee_image_arrayaccum]
