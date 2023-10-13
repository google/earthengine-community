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

# [START earthengine__apidocs__ee_image_expression]
# The following expressions calculate the normalized difference vegetation
# index (NDVI): (NIR - Red) / (NIR + Red).
# NIR is Landsat 8 L2 band 'SR_B5', the 4th band index.
# Red is Landsat 8 L2 band 'SR_B4', the 3rd band index.

# A Landsat 8 L2 surface reflectance image.
img = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20210508')

# Visualization parameters for NDVI.
ndvi_vis = {'min': 0, 'max': 0.5}

# Expression using image band indices.
band_index_exp = '(b(4) - b(3)) / (b(4) + b(3))'
band_index_img = img.expression(band_index_exp).rename('NDVI')
m = geemap.Map()
m.set_center(-122.14, 37.38, 11)
m.add_layer(band_index_img, ndvi_vis, 'NDVI 1')

# Expression using image band names.
band_name_exp = '(b("SR_B5") - b("SR_B4")) / (b("SR_B5") + b("SR_B4"))'
band_name_img = img.expression(band_name_exp).rename('NDVI')
m.add_layer(band_name_img, ndvi_vis, 'NDVI 2')

# Expression using named variables.
named_vars_exp = '(NIR - Red) / (NIR + Red)'
named_vars_img = (
    ee.Image()
    .expression(
        expression=named_vars_exp,
        opt_map={'NIR': img.select('SR_B5'), 'Red': img.select('SR_B4')},
    )
    .rename('NDVI')
)
m.add_layer(named_vars_img, ndvi_vis, 'NDVI 3')

# Expression using named variables with image band access by dot notation.
named_vars_dot_exp = '(ls8.SR_B5 - ls8.SR_B4) / (ls8.SR_B5 + ls8.SR_B4)'
named_vars_dot_img = (
    ee.Image()
    .expression(expression=named_vars_dot_exp, opt_map={'ls8': img})
    .rename('NDVI')
)
m.add_layer(named_vars_dot_img, ndvi_vis, 'NDVI 4')

# Expressions can use arithmetic operators (+ - * / % **), relational
# operators (== != < > <= >=), logical operators (&& || ! ^), the ternary
# operator (condition ? ifTrue : ifFalse), and a subset of JavaScript Math
# functions. Math functions are called by name directly, they are not accessed
# from the Math object (e.g., sqrt() instead of Math.sqrt()).
js_math_exp = 'c = sqrt(pow(a, 2) + pow(b, 2))'
js_math_img = ee.Image().expression(
    expression=js_math_exp, opt_map={'a': ee.Image(5), 'b': img.select('SR_B2')}
)
m.add_layer(js_math_img, {'min': 5000, 'max': 20000}, 'Hypotenuse', False)
m
# [END earthengine__apidocs__ee_image_expression]
