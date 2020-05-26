# Copyright 2020 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License")
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Earth Engine Developer's Guide examples from 'Images - Gradients' page."""

import ee
ee.Initialize()

# [START earthengine__images12__gradients]
# Load a Landsat 8 image and select the panchromatic band.
image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318').select('B8')

# Compute the image gradient in the X and Y directions.
xy_grad = image.gradient()

# Compute the magnitude of the gradient.
gradient = xy_grad.select('x').pow(2).add(xy_grad.select('y').pow(2)).sqrt()

# Compute the direction of the gradient.
direction = xy_grad.select('y').atan2(xy_grad.select('x'))
# [END earthengine__images12__gradients]
