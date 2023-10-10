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

# [START earthengine__apidocs__ee_geometry_linearring_distance]
# Define a LinearRing object.
linearring = ee.Geometry.LinearRing(
    [[-122.091, 37.420], [-122.085, 37.422], [-122.080, 37.430]]
)

# Define other inputs.
input_geom = ee.Geometry.Point(-122.090, 37.423)

# Apply the distance method to the LinearRing object.
linearring_distance = linearring.distance(right=input_geom, maxError=1)

# Print the result.
display('linearring.distance(...) =', linearring_distance)

# Display relevant geometries on the map.
m = geemap.Map()
m.set_center(-122.085, 37.422, 15)
m.add_layer(linearring, {'color': 'black'}, 'Geometry [black]: linearring')
m.add_layer(input_geom, {'color': 'blue'}, 'Parameter [blue]: input_geom')
m
# [END earthengine__apidocs__ee_geometry_linearring_distance]
