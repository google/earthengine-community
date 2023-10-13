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


# [START earthengine__apidocs__ee_image_toarray]
# A function to print arrays for a selected pixel in the following examples.
def samp_arr_img(arr_img):
  point = ee.Geometry.Point([-121, 42])
  return arr_img.sample(point, 500).first().get('array')


# A 3-band image of constants.
img = ee.Image([0, 1, 2])
display('3-band image', img)

# Convert the 3-band image to an array image. The resulting array image has a
# single band named "array". The "array" band stores the per-pixel band values
# from the input ee.Image as a 1D array.
array_img_1_d = img.toArray()
display('1D array image', array_img_1_d)

# Sample a single pixel to see its 1D array using the `samp_arr_img` function
# defined above. Similar arrays are present for all pixels in a given array
# image looking at just one helps conceptualize the structure.
display('1D array image (pixel)', samp_arr_img(array_img_1_d))
# [0, 1, 2]

# Array images can be displayed to the Code Editor map and queried with the
# inspector tool. Per-pixel, the first element in the array is shown.
# Single-band grayscale is used to represent the data. Style parameters `min`
# and `max` are valid. Styling the layer with the Code Editor's layer
# visualization tool is invalid.
m = geemap.Map()
m.add_layer(array_img_1_d, {'min': 0, 'max': 2}, 'Image array')
display(m)

# Create a 2D array image by concatenating the values in a 1D array image
# along the 1-axis using `toArray(1)`. For a 3D array, apply `toArray(2)` to
# the result.
array_img_2_d = array_img_1_d.toArray(1)
display('2D array image (pixel)', samp_arr_img(array_img_2_d))
# [[0],
#  [1],
#  [2]]
# [END earthengine__apidocs__ee_image_toarray]
