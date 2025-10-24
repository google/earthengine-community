# Copyright 2021 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_image_not]
"""Demonstrates the ee.Image.Not method.

This example uses positive integers; non-integer and negative
values are allowed.
"""
not_zeros = ee.Image(3)  # Define an image where all pixels are not zero.
zeros = not_zeros.Not()  # Pixels are not zeros, return zeros.
ones = zeros.Not()  # Pixels are zeros, return ones.

display('zeros:', zeros)
display('ones:', ones)

# Sample images at a location and print the results.
loc = ee.Geometry.Point(0, 0)  # Location to sample image values.
display('not_zeros:', not_zeros.sample(loc, 1).first().get('constant'))
display('zeros:', zeros.sample(loc, 1).first().get('constant'))
display('ones:', ones.sample(loc, 1).first().get('constant'))
# [END earthengine__apidocs__ee_image_not]
