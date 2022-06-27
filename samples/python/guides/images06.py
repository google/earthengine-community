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

"""Google Earth Engine Developer's Guide examples for 'Images - Mathematical operations'."""

# [START earthengine__images06__evi_expression]
# Load a Landsat 8 image.
image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')

# Compute the EVI using an expression.
evi = image.expression(
    '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
        'NIR': image.select('B5'),
        'RED': image.select('B4'),
        'BLUE': image.select('B2')
    })

# Define a map centered on San Francisco Bay.
map_evi = folium.Map(location=[37.4675, -122.1363], zoom_start=9)

# Add the image layer to the map and display it.
map_evi.add_ee_layer(evi, {
    'min': -1,
    'max': 1,
    'palette': ['a6611a', 'f5f5f5', '4dac26']
}, 'evi')
display(map_evi)
# [END earthengine__images06__evi_expression]
