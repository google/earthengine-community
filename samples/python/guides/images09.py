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

"""Google Earth Engine Developer's Guide examples for 'Images - Relational, conditional and Boolean operations'."""

# [START earthengine__images09__where_operator]
# Load a cloudy Landsat 8 image.
image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20130603')

# Load another image to replace the cloudy pixels.
replacement = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20130416')

# Compute a cloud score band.
cloud = ee.Algorithms.Landsat.simpleCloudScore(image).select('cloud')

# Set cloudy pixels to the other image.
replaced = image.where(cloud.gt(10), replacement)

# Define a map centered on San Francisco Bay.
map_4 = folium.Map(location=[37.4675, -122.1363], zoom_start=9)

# Add the image layer to the map and display it.
map_4.add_ee_layer(replaced,
                   {'bands': ['B5', 'B4', 'B3'], 'min': 0, 'max': 0.5},
                   'clouds replaced')
display(map_4)
# [END earthengine__images09__where_operator]
