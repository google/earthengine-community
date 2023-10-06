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

"""Earth Engine Developer's Guide Python example setup."""

# [START earthengine__dependencies__ee_setup]
import ee
ee.Authenticate()
ee.Initialize()
# [END earthengine__dependencies__ee_setup]

# [START earthengine__dependencies__pprint_import]
import pprint
# [END earthengine__dependencies__pprint_import]

# [START earthengine__dependencies__folium_import]
import folium
# [END earthengine__dependencies__folium_import]

# [START earthengine__dependencies__folium_setup]
def add_ee_layer(self, ee_image_object, vis_params, name):
  map_id_dict = ee.Image(ee_image_object).getMapId(vis_params)
  folium.raster_layers.TileLayer(
      tiles=map_id_dict['tile_fetcher'].url_format,
      attr='Map Data &copy; <a href="https://earthengine.google.com/">Google Earth Engine</a>',
      name=name,
      overlay=True,
      control=True
  ).add_to(self)

folium.Map.add_ee_layer = add_ee_layer
# [END earthengine__dependencies__folium_setup]

# [START earthengine__dependencies__geemap_import]
import geemap
# [END earthengine__dependencies__geemap_import]

# [START earthengine__dependencies__python_setup]
import ee
import geemap
# [END earthengine__dependencies__python_setup]

# [START earthengine__dependencies__geemap_example]
# Initialize a map object.
m = geemap.Map()

# Define an example image.
img = ee.Image.random()

# Add the image to the map.
m.add_ee_layer(img, None, 'Random image')

# Display the map (you can call the object directly if it is the final line).
display(m)
# [END earthengine__dependencies__geemap_example]
