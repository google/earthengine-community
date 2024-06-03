# Copyright 2024 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


#  Earth Engine Developer's Guide examples
#   from 'Visualizing Features and FeatureCollections' page.


# [START earthengine__features05__map_add]
# Load a FeatureCollection from a table dataset: 'RESOLVE' ecoregions.
ecoregions = ee.FeatureCollection('RESOLVE/ECOREGIONS/2017')

# Display as default and with a custom color.
m = geemap.Map()
m.set_center(-76.2486, 44.8988, 8)
m.add_layer(ecoregions, {}, 'default display')
m.add_layer(ecoregions, {'color': 'FF0000'}, 'colored')
m
# [END earthengine__features05__map_add]

# [START earthengine__features05__draw]
m.add_layer(ecoregions.draw(color='006600', strokeWidth=5), {}, 'drawn')
# [END earthengine__features05__draw]

# [START earthengine__features05__paint_simple]
# Create an empty image into which to paint the features, cast to byte.
empty = ee.Image().byte()

# Paint all the polygon edges with the same number and width, display.
outline = empty.paint(featureCollection=ecoregions, color=1, width=3)
m.add_layer(outline, {'palette': 'FF0000'}, 'edges')
# [END earthengine__features05__paint_simple]

# [START earthengine__features05__color_property]
# Paint the edges with different colors, display.
outlines = empty.paint(featureCollection=ecoregions, color='BIOME_NUM', width=4)
palette = ['FF0000', '00FF00', '0000FF']
m.add_layer(outlines, {'palette': palette, 'max': 14}, 'different color edges')
# [END earthengine__features05__color_property]

# [START earthengine__features05__color_width]
# Paint the edges with different colors and widths.
outlines = empty.paint(
    featureCollection=ecoregions, color='BIOME_NUM', width='NNH'
)
m.add_layer(
    outlines, {'palette': palette, 'max': 14}, 'different color, width edges'
)
# [END earthengine__features05__color_width]

# [START earthengine__features05__fill]
# Paint the interior of the polygons with different colors.
fills = empty.paint(featureCollection=ecoregions, color='BIOME_NUM')
m.add_layer(fills, {'palette': palette, 'max': 14}, 'colored fills')
# [END earthengine__features05__fill]

# [START earthengine__features05__fill_edges]
# Paint both the fill and the edges.
filled_outlines = empty.paint(ecoregions, 'BIOME_NUM').paint(ecoregions, 0, 2)
m.add_layer(
    filled_outlines,
    {'palette': ['000000'] + palette, 'max': 14},
    'edges and fills',
)
# [END earthengine__features05__fill_edges]
