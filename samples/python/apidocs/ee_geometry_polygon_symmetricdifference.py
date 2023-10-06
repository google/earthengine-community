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

# [START earthengine__apidocs__ee_geometry_polygon_symmetricdifference]
# Define a Polygon object.
polygon = ee.Geometry.Polygon([[
    [-122.092, 37.424],
    [-122.086, 37.418],
    [-122.079, 37.425],
    [-122.085, 37.423],
]])

# Define other inputs.
input_geom = ee.Geometry.BBox(-122.085, 37.415, -122.075, 37.425)

# Apply the symmetricDifference method to the Polygon object.
polygon_symmetric_difference = polygon.symmetricDifference(
    right=input_geom, maxError=1
)

# Print the result.
display('polygon.symmetricDifference(...) =', polygon_symmetric_difference)

# Display relevant geometries on the map.
m = geemap.Map()
m.set_center(-122.085, 37.422, 15)
m.add_ee_layer(polygon, {'color': 'black'}, 'Geometry [black]: polygon')
m.add_ee_layer(input_geom, {'color': 'blue'}, 'Parameter [blue]: input_geom')
m.add_ee_layer(
    polygon_symmetric_difference,
    {'color': 'red'},
    'Result [red]: polygon.symmetricDifference',
)
m
# [END earthengine__apidocs__ee_geometry_polygon_symmetricdifference]
