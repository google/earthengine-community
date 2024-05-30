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
#   from 'Compositing and mosaicking' page.

# [START earthengine__image_collections08__masked_mosaic]
# Load a NAIP quarter quad, display.
naip = ee.Image('USDA/NAIP/DOQQ/m_4207148_nw_19_1_20120710')
m = geemap.Map()
m.set_center(-71.0915, 42.3443, 14)
m.add_layer(naip, {}, 'NAIP DOQQ')

# Create the NDVI and NDWI spectral indices.
ndvi = naip.normalizedDifference(['N', 'R'])
ndwi = naip.normalizedDifference(['G', 'N'])

# Create some binary images from thresholds on the indices.
# This threshold is designed to detect bare land.
bare_1 = ndvi.lt(0.2).And(ndwi.lt(0.3))
# This detects bare land with lower sensitivity. It also detects shadows.
bare_2 = ndvi.lt(0.2).And(ndwi.lt(0.8))

# Mask and mosaic visualization images. The last layer is on top.
mosaic = ee.ImageCollection([
    # NDWI > 0.5 is water. Visualize it with a blue palette.
    ndwi.updateMask(ndwi.gte(0.5)).visualize(
        min=0.5, max=1, palette=['00FFFF', '0000FF']
    ),
    # NDVI > 0.2 is vegetation. Visualize it with a green palette.
    ndvi.updateMask(ndvi.gte(0.2)).visualize(
        min=-1, max=1, palette=['FF0000', '00FF00']
    ),
    # Visualize bare areas with shadow (bare_2 but not bare_1) as gray.
    bare_2.updateMask(bare_2.And(bare_1.Not())).visualize(palette=['AAAAAA']),
    # Visualize the other bare areas as white.
    bare_1.updateMask(bare_1).visualize(palette=['FFFFFF']),
]).mosaic()
m.add_layer(mosaic, {}, 'Visualization mosaic')
m
# [END earthengine__image_collections08__masked_mosaic]
