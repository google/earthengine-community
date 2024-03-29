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

# [START earthengine__apidocs__ee_geometry_multilinestring_dissolve]
# Define a MultiLineString object.
multilinestring = ee.Geometry.MultiLineString([
    [[-122.088, 37.418], [-122.086, 37.422], [-122.082, 37.418]],
    [[-122.087, 37.416], [-122.083, 37.416], [-122.082, 37.419]],
])

# Apply the dissolve method to the MultiLineString object.
multilinestring_dissolve = multilinestring.dissolve(maxError=1)

# Print the result.
display('multilinestring.dissolve(...) =', multilinestring_dissolve)

# Display relevant geometries on the map.
m = geemap.Map()
m.set_center(-122.085, 37.422, 15)
m.add_layer(
    multilinestring, {'color': 'black'}, 'Geometry [black]: multilinestring'
)
m.add_layer(
    multilinestring_dissolve,
    {'color': 'red'},
    'Result [red]: multilinestring.dissolve',
)
m
# [END earthengine__apidocs__ee_geometry_multilinestring_dissolve]
