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

"""Google Earth Engine Developer's Guide examples for 'Images - Gradients'."""

# [START earthengine__images12__gradients]
# Load a Landsat 8 image and select the panchromatic band.
image = ee.Image('LANDSAT/LC08/C02/T1/LC08_044034_20140318').select('B8')

# Compute the image gradient in the X and Y directions.
xy_grad = image.gradient()

# Compute the magnitude of the gradient.
gradient = xy_grad.select('x').pow(2).add(xy_grad.select('y').pow(2)).sqrt()

# Compute the direction of the gradient.
direction = xy_grad.select('y').atan2(xy_grad.select('x'))

# Define a map centered on San Francisco Bay.
map_gradient = folium.Map(location=[37.7295, -122.054], zoom_start=10)

# Add the image layers to the map and display it.
map_gradient.add_ee_layer(
    direction, {'min': -2, 'max': 2, 'format': 'png'}, 'direction')
map_gradient.add_ee_layer(
    gradient, {'min': -7, 'max': 7, 'format': 'png'}, 'gradient')
display(map_gradient.add_child(folium.LayerControl()))
# [END earthengine__images12__gradients]
