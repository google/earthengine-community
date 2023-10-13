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

# [START earthengine__apidocs__ee_featurecollection_getmap]
# FeatureCollection of power plants in Belgium.
fc = ee.FeatureCollection('WRI/GPPD/power_plants').filter(
    'country_lg == "Belgium"'
)

# Get MapId for styled FeatureCollection.
map_id = fc.getMapId({'color': '800080'})
display('map_id for FeatureCollection', map_id)

# MapId can be used as an input to geemap.Map.add_layer to display the layer.
m = geemap.Map()
m.set_center(4.56, 50.78, 7)
m.add_layer(map_id['image'])
display(m)

# MapId can be used as an input to ee.data.getTileUrl to fetch map tiles.
display(
    'URL for zoom level 6 tile that includes majority of points',
    ee.data.getTileUrl(map_id, 32, 21, 6),
)
# [END earthengine__apidocs__ee_featurecollection_getmap]
