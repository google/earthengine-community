# Copyright 2025 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_featurecollection_loadbigquerytable]

# Load stations from the New York Subway System.
features = ee.FeatureCollection.loadBigQueryTable(
    table="bigquery-public-data.new_york_subway.stations",
    geometryColumn="station_geom")

# Display all relevant features on the map.
m = geemap.Map()
m.set_center(-73.90, 40.73, 11)
m.add_layer(
    features, {'color': 'black'}, 'Stations from New York Subway System')

# Print all stations in the "Astoria" line.
line = features.filter(ee.Filter.eq('line', 'Astoria'))
display(line)
m.add_layer(line, {'color': 'yellow'}, 'Astoria line')
m
# [END earthengine__apidocs__ee_featurecollection_loadbigquerytable]