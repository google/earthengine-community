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
#   from 'Reducers - reduceToVectors' section.

# [START earthengine__reducers05__reduce_to_vectors]
# Load a Japan boundary from the Large Scale International Boundary dataset.
japan = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017').filter(
    ee.Filter.eq('country_na', 'Japan')
)

# Load a 2012 nightlights image, clipped to the Japan border.
nl_2012 = (
    ee.Image('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F182012')
    .select('stable_lights')
    .clipToCollection(japan)
)

# Define arbitrary thresholds on the 6-bit nightlights image.
zones = nl_2012.gt(30).add(nl_2012.gt(55)).add(nl_2012.gt(62))
zones = zones.updateMask(zones.neq(0))

# Convert the zones of the thresholded nightlights to vectors.
vectors = zones.addBands(nl_2012).reduceToVectors(
    geometry=japan,
    crs=nl_2012.projection(),
    scale=1000,
    geometryType='polygon',
    eightConnected=False,
    labelProperty='zone',
    reducer=ee.Reducer.mean(),
)

# Display the thresholds.
m = geemap.Map()
m.set_center(139.6225, 35.712, 9)
m.add_layer(
    zones,
    {'min': 1, 'max': 3, 'palette': ['0000FF', '00FF00', 'FF0000']},
    'raster',
)

# Make a display image for the vectors, add it to the map.
display_image = ee.Image(0).updateMask(0).paint(vectors, '000000', 3)
m.add_layer(display_image, {'palette': '000000'}, 'vectors')
m
# [END earthengine__reducers05__reduce_to_vectors]
