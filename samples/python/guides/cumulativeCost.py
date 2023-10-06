# Copyright 2021 The Google Earth Engine Community Authors
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

"""Google Earth Engine Developer's Guide examples from 'Images - Cumulative Cost' page."""

# [START earthengine__cumulativeCost__cost]
# A rectangle representing Bangui, Central African Republic.
geometry = ee.Geometry.Rectangle([18.5229, 4.3491, 18.5833, 4.4066])

# Create a source image where the geometry is 1, everything else is 0.
sources = ee.Image().toByte().paint(geometry, 1)

# Mask the sources image with itself.
sources = sources.selfMask()

# The cost data is generated from classes in ESA/GLOBCOVER.
cover = ee.Image('ESA/GLOBCOVER_L4_200901_200912_V2_3').select(0)

# Classes 60, 80, 110, 140 have cost 1.
# Classes 40, 90, 120, 130, 170 have cost 2.
# Classes 50, 70, 150, 160 have cost 3.
before_remap = [60, 80, 110, 140, 40, 90, 120, 130, 170, 50, 70, 150, 160]
after_remap = [1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3]
cost = cover.remap(before_remap, after_remap, 0)

# Compute the cumulative cost to traverse the land cover.
cumulative_cost = cost.cumulativeCost(
    source=sources, maxDistance=(80 * 1000)  # 80 kilometers
)

# Define a map centered on Central Africa.
map_cost = geemap.Map(center=[4.2, 18.71], zoom=9)

# Add the image layers to the map and display it.
map_cost.add_ee_layer(cover, None, 'Globcover')
map_cost.add_ee_layer(
    cumulative_cost, {'min': 0, 'max': 5e4}, 'accumulated cost'
)
map_cost.add_ee_layer(
    ee.Image().byte().paint(geometry), {'palette': 'FF0000'}, 'source geometry'
)
display(map_cost)
# [END earthengine__cumulativeCost__cost]
