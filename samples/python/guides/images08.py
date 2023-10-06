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

# [START earthengine__images08__conditional]
# Load a 2012 nightlights image.
nl_2012 = ee.Image('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F182012')
lights = nl_2012.select('stable_lights')

# Define arbitrary thresholds on the 6-bit stable lights band.
zones = lights.gt(30).add(lights.gt(55)).add(lights.gt(62))

# Define a map centered on Paris, France.
map_zones = geemap.Map(center=[48.8683, 2.373], zoom=8)

# Display the thresholded image as three distinct zones near Paris.
palette = ['000000', '0000FF', '00FF00', 'FF0000']
map_zones.add_ee_layer(
    zones, {'min': 0, 'max': 3, 'palette': palette}, 'development zones'
)
display(map_zones)
# [END earthengine__images08__conditional]

# [START earthengine__images08__conditional_exp]
# Create zones using an expression, display.
zones_exp = nl_2012.expression(
    "(b('stable_lights') > 62) ? 3 "
    ": (b('stable_lights') > 55) ? 2 "
    ": (b('stable_lights') > 30) ? 1 "
    ': 0'
)

# Define a map centered on Paris, France.
map_zones_exp = geemap.Map(center=[48.8683, 2.373], zoom=8)

# Add the image layer to the map and display it.
map_zones_exp.add_ee_layer(
    zones_exp, {'min': 0, 'max': 3, 'palette': palette}, 'zones exp'
)
display(map_zones_exp)
# [END earthengine__images08__conditional_exp]
