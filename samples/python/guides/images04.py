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

# [START earthengine__images04__palettized]
# Load 2012 MODIS land cover and select the IGBP classification.
cover = ee.Image('MODIS/051/MCD12Q1/2012_01_01').select('Land_Cover_Type_1')

# Define a palette for the 18 distinct land cover classes.
igbp_palette = [
    'aec3d4',  # water
    '152106',
    '225129',
    '369b47',
    '30eb5b',
    '387242',  # forest
    '6a2325',
    'c3aa69',
    'b76031',
    'd9903d',
    '91af40',  # shrub, grass
    '111149',  # wetlands
    'cdb33b',  # croplands
    'cc0013',  # urban
    '33280d',  # crop mosaic
    'd7cdcc',  # snow and ice
    'f7e084',  # barren
    '6f6f6f',  # tundra
]

# Define a map centered on the United States.
map_palette = geemap.Map(center=[40.413, -99.229], zoom=5)

# Add the image layer to the map and display it. Specify the min and max labels
# and the color palette matching the labels.
map_palette.add_ee_layer(
    cover, {'min': 0, 'max': 17, 'palette': igbp_palette}, 'IGBP classes'
)
display(map_palette)
# [END earthengine__images04__palettized]

# [START earthengine__images04__sld_style]
cover = ee.Image('MODIS/051/MCD12Q1/2012_01_01').select('Land_Cover_Type_1')

# Define an SLD style of discrete intervals to apply to the image.
sld_intervals = """
<RasterSymbolizer>
  <ColorMap  type="intervals" extended="false" >
    <ColorMapEntry color="#aec3d4" quantity="0" label="Water"/>
    <ColorMapEntry color="#152106" quantity="1" label="Evergreen Needleleaf Forest"/>
    <ColorMapEntry color="#225129" quantity="2" label="Evergreen Broadleaf Forest"/>
    <ColorMapEntry color="#369b47" quantity="3" label="Deciduous Needleleaf Forest"/>
    <ColorMapEntry color="#30eb5b" quantity="4" label="Deciduous Broadleaf Forest"/>
    <ColorMapEntry color="#387242" quantity="5" label="Mixed Deciduous Forest"/>
    <ColorMapEntry color="#6a2325" quantity="6" label="Closed Shrubland"/>
    <ColorMapEntry color="#c3aa69" quantity="7" label="Open Shrubland"/>
    <ColorMapEntry color="#b76031" quantity="8" label="Woody Savanna"/>
    <ColorMapEntry color="#d9903d" quantity="9" label="Savanna"/>
    <ColorMapEntry color="#91af40" quantity="10" label="Grassland"/>
    <ColorMapEntry color="#111149" quantity="11" label="Permanent Wetland"/>
    <ColorMapEntry color="#cdb33b" quantity="12" label="Cropland"/>
    <ColorMapEntry color="#cc0013" quantity="13" label="Urban"/>
    <ColorMapEntry color="#33280d" quantity="14" label="Crop, Natural Veg. Mosaic"/>
    <ColorMapEntry color="#d7cdcc" quantity="15" label="Permanent Snow, Ice"/>
    <ColorMapEntry color="#f7e084" quantity="16" label="Barren, Desert"/>
    <ColorMapEntry color="#6f6f6f" quantity="17" label="Tundra"/>
  </ColorMap>
</RasterSymbolizer>"""

# Apply the SLD style to the image.
cover_sld = cover.sldStyle(sld_intervals)

# Define a map centered on the United States.
map_sld_categorical = geemap.Map(center=[40.413, -99.229], zoom=5)

# Add the image layer to the map and display it.
map_sld_categorical.add_ee_layer(cover_sld, None, 'IGBP classes styled')
display(map_sld_categorical)
# [END earthengine__images04__sld_style]
