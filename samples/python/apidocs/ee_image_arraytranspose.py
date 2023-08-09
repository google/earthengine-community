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

# [START earthengine__apidocs__ee_image_arraytranspose]
# A function to print arrays for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')

# Create a 2D array image.
array_img_2d = ee.Image([0, 1, 2, 3, 4, 5]).toArray().arrayReshape(
    ee.Image([2, 3]).toArray(),
    2
)
print('2D 2x3 array image (pixel):', samp_arr_img(array_img_2d).getInfo())
# [[0, 1, 2],
#  [3, 4, 5]]

# Swap 0-axis and 1-axis. Input is a 2x3 array, output will be 3x2.
transposed = array_img_2d.arrayTranspose()
print('Transposed (3x2) array image (pixel):',
      samp_arr_img(transposed).getInfo())
# [[0, 3],
#  [1, 4],
#  [2, 5]]
# [END earthengine__apidocs__ee_image_arraytranspose]
