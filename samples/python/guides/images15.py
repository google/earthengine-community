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

"""Google Earth Engine Developer's Guide examples for 'Images - Spectral transformations'."""

# [START earthengine__images15__pan_sharpening]
# Load a Landsat 8 top-of-atmosphere reflectance image.
image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')

# Convert the RGB bands to the HSV color space.
hsv = image.select(['B4', 'B3', 'B2']).rgbToHsv()

# Swap in the panchromatic band and convert back to RGB.
sharpened = ee.Image.cat(
    [hsv.select('hue'),
     hsv.select('saturation'),
     image.select('B8')]).hsvToRgb()

# Define a map centered on San Francisco, California.
map_sharpened = folium.Map(location=[37.76664, -122.44829], zoom_start=13)

# Add the image layers to the map and display it.
map_sharpened.add_ee_layer(image, {
    'bands': ['B4', 'B3', 'B2'], 'min': 0, 'max': 0.25, 'gamma': [1.1, 1.1, 1]
}, 'rgb')
map_sharpened.add_ee_layer(sharpened, {
    'min': 0, 'max': 0.25, 'gamma': [1.3, 1.3, 1.3]
}, 'pan-sharpened')
display(map_sharpened.add_child(folium.LayerControl()))
# [END earthengine__images15__pan_sharpening]
