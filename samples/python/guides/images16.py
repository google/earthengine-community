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

# [START earthengine__images16__unmixing]
# Load a Landsat 5 image and select the bands we want to unmix.
bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']
image = ee.Image('LANDSAT/LT05/C02/T1/LT05_044034_20080214').select(bands)

# Define spectral endmembers.
urban = [88, 42, 48, 38, 86, 115, 59]
veg = [50, 21, 20, 35, 50, 110, 23]
water = [51, 20, 14, 9, 7, 116, 4]

# Unmix the image.
fractions = image.unmix([urban, veg, water])

# Define a map centered on San Francisco Bay.
map_fractions = folium.Map(location=[37.5010, -122.1899], zoom_start=10)

# Add the image layers to the map and display it.
map_fractions.add_ee_layer(
    image, {'bands': ['B4', 'B3', 'B2'], 'min': 0, 'max': 128}, 'image')
map_fractions.add_ee_layer(fractions, None, 'unmixed')
display(map_fractions.add_child(folium.LayerControl()))
# [END earthengine__images16__unmixing]
