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

# [START earthengine__apidocs__ee_geometry_multipolygon_togeojson]
# Define a MultiPolygon object.
multipolygon = ee.Geometry.MultiPolygon([
    [[
        [-122.092, 37.424],
        [-122.086, 37.418],
        [-122.079, 37.425],
        [-122.085, 37.423],
    ]],
    [[[-122.081, 37.417], [-122.086, 37.421], [-122.089, 37.416]]],
])

# Apply the toGeoJSON method to the MultiPolygon object.
multipolygon_to_geojson = multipolygon.toGeoJSON()

# Print the result.
display('multipolygon.toGeoJSON(...) =', multipolygon_to_geojson)

# Display relevant geometries on the map.
m = geemap.Map()
m.set_center(-122.085, 37.422, 15)
m.add_layer(
    multipolygon, {'color': 'black'}, 'Geometry [black]: multipolygon'
)
m
# [END earthengine__apidocs__ee_geometry_multipolygon_togeojson]
