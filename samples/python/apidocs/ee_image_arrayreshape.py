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

# [START earthengine__apidocs__ee_image_arrayreshape]
# A function to print arrays for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# Create a 1D array image with length 6.
array_img_1d = ee.Image([0, 1, 2, 3, 4, 5]).toArray()
print('1D array image (pixel):', samp_arr_img(array_img_1d).getInfo())
# [0, 1, 2, 3, 4, 5]

# Reshape the 1D 6-element array to a 2D 2 (row) x 3 (column) array. Notice
# that elements are filled row by row in the reshaped result.
reshape2x3 = array_img_1d.arrayReshape(ee.Image([2, 3]).toArray(), 2)
print('2D 2x3 array image (pixel):', samp_arr_img(reshape2x3).getInfo())
# [[0, 1, 2],
#  [3, 4, 5]]

# Use -1 to auto-determine a dimension length. For example, here we set
# 3 rows and let Earth Engine determine the number of columns needed.
reshape3x_ = array_img_1d.arrayReshape(ee.Image([3, -1]).toArray(), 2)
print('2D 3x? array image (pixel):', samp_arr_img(reshape3x_).getInfo())
# [[0, 1],
#  [2, 3],
#  [4, 5]]

# Flatten a 2D 2x3 array to 1D 6-element array.
flattened = reshape2x3.arrayReshape(ee.Image([-1]).toArray(), 1)
print('2D array flattened to 1D:', samp_arr_img(flattened).getInfo())
# [0, 1, 2, 3, 4, 5]
# [END earthengine__apidocs__ee_image_arrayreshape]
