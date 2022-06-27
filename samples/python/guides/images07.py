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

# [START earthengine__images07__thresholding]
# Load a Landsat 8 image.
image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')

# Create NDVI and NDWI spectral indices.
ndvi = image.normalizedDifference(['B5', 'B4'])
ndwi = image.normalizedDifference(['B3', 'B5'])

# Create a binary layer using logical operations.
bare = ndvi.lt(0.2).And(ndwi.lt(0))

# Define a map centered on San Francisco Bay.
map_bare = folium.Map(location=[37.7726, -122.3578], zoom_start=12)

# Add the masked image layer to the map and display it.
map_bare.add_ee_layer(bare.selfMask(), None, 'bare')
display(map_bare)
# [END earthengine__images07__thresholding]
