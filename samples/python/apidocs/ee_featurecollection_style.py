# Copyright 2023 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START earthengine__apidocs__ee_featurecollection_style]
# FeatureCollection of power plants in Belgium.
fc = ee.FeatureCollection('WRI/GPPD/power_plants').filter(
    'country_lg == "Belgium"'
)

# Paint FeatureCollection to an image using collection-wide style arguments.
fc_vis = fc.style(
    color='1e90ff',
    width=2,
    fillColor='ff475788',  # with alpha set for partial transparency
    lineType='dotted',
    pointSize=10,
    pointShape='circle',
)

# Display the FeatureCollection visualization (ee.Image) on the map.
m = geemap.Map()
m.set_center(4.326, 50.919, 9)
m.add_layer(fc_vis, None, 'Collection-wide style')

# Paint FeatureCollection to an image using feature-specific style arguments.
# A dictionary of style properties per power plant fuel type.
fuel_styles = ee.Dictionary({
    'Wind': {'color': 'blue', 'pointSize': 5, 'pointShape': 'circle'},
    'Gas': {'color': 'yellow', 'pointSize': 6, 'pointShape': 'square'},
    'Oil': {'color': 'green', 'pointSize': 3, 'pointShape': 'diamond'},
    'Coal': {'color': 'red', 'pointSize': 3, 'pointShape': 'cross'},
    'Hydro': {'color': 'brown', 'pointSize': 3, 'pointShape': 'star5'},
    'Biomass': {'color': 'orange', 'pointSize': 4, 'pointShape': 'triangle'},
    'Nuclear': {'color': 'purple', 'pointSize': 6, 'pointShape': 'hexagram'},
})

# Add feature-specific style properties to each feature based on fuel type.
fc = fc.map(
    lambda feature: feature.set('style', fuel_styles.get(feature.get('fuel1')))
)

# Style the FeatureCollection according to each feature's "style" property.
fc_vis_custom = fc.style(
    styleProperty='style',
    neighborhood=8,  # maximum "pointSize" + "width" among features
)

# Display the FeatureCollection visualization (ee.Image) on the map.
m.add_layer(fc_vis_custom, None, 'Feature-specific style')
m
# [END earthengine__apidocs__ee_featurecollection_style]
