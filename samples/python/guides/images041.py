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

"""Google Earth Engine Developer's Guide examples for 'Images - Visualization'."""

# [START earthengine__images041__sld_stretch]
# Load a Landsat 8 raw image.
image = ee.Image('LANDSAT/LC08/C02/T1/LC08_044034_20140318')

# Define a RasterSymbolizer element with '_enhance_' for a placeholder.
template_sld = """
<RasterSymbolizer>
  <ContrastEnhancement><_enhance_/></ContrastEnhancement>
  <ChannelSelection>
    <RedChannel>
      <SourceChannelName>B5</SourceChannelName>
    </RedChannel>
    <GreenChannel>
      <SourceChannelName>B4</SourceChannelName>
    </GreenChannel>
    <BlueChannel>
      <SourceChannelName>B3</SourceChannelName>
    </BlueChannel>
  </ChannelSelection>
</RasterSymbolizer>"""

# Get SLDs with different enhancements.
equalize_sld = template_sld.replace('_enhance_', 'Histogram')
normalize_sld = template_sld.replace('_enhance_', 'Normalize')

# Define a map centered on San Francisco Bay.
map_sld_continuous = folium.Map(location=[37.5010, -122.1899], zoom_start=10)

# Add the image layers to the map and display it.
map_sld_continuous.add_ee_layer(
    image, {'bands': ['B5', 'B4', 'B3'], 'min': 0, 'max': 15000}, 'Linear')
map_sld_continuous.add_ee_layer(
    image.sldStyle(equalize_sld), None, 'Equalized')
map_sld_continuous.add_ee_layer(
    image.sldStyle(normalize_sld), None, 'Normalized')
display(map_sld_continuous.add_child(folium.LayerControl()))
# [END earthengine__images041__sld_stretch]
