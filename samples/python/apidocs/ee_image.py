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

# [START earthengine__apidocs__ee_image]
image = ee.Image('JAXA/ALOS/AW3D30/V2_2')

m = geemap.Map()
m.zoom = 3
display(m)
m.add_ee_layer(image.select('AVE_DSM'), {'min': -1e3, 'max': 5e3}, 'AVE_DSM')
# Image JAXA/ALOS/AW3D30/V2_2 (3 bands)
# type: Image
# id: JAXA/ALOS/AW3D30/V2_2
# version: 1595337806697615
# 'bands': List (3 elements)
# properties: Object (21 properties)
display(image)

transparent = ee.Image()
m.add_ee_layer(transparent, None, 'transparent', False)
# Image (1 band)
# type: Image
# 'bands': List (1 element)
# 0: "constant", int ∈ [0, 0], EPSG:4326
display(transparent)

# Create a multi-band image from a list of constants.
orange = ee.Image([0xFF, 0x88, 0x00])
m.add_ee_layer(orange, {'min': 0, 'max': 0xFF}, 'orange', False)
# Image (3 bands)
# type: Image
# 'bands': List (3 elements)
# 0: "constant", int ∈ [255, 255], EPSG:4326
# 1: "constant_1", int ∈ [136, 136], EPSG:4326
# 2: "constant_2", int ∈ [0, 0], EPSG:4326
display(orange)

# Create a one band image where each pixel is an array of three values.
image_of_array = ee.Image(ee.Array([0x00, 0x00, 0xFF]))
m.add_ee_layer(image_of_array, None, 'image_of_array', False)
# Image (1 band)
# type: Image
# 'bands': List (1 element)
# 0: "constant", unsigned int8, 1 dimension, EPSG:4326
# id: constant
# crs: EPSG:4326
# crs_transform: [1,0,0,0,1,0]
# data_type: unsigned int8, 1 dimension
# type: PixelType
# dimensions: 1
# 'max': 255
# 'min': 0
# precision: int
display(image_of_array)
# [END earthengine__apidocs__ee_image]
