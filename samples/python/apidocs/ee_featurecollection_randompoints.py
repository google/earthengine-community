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

# [START earthengine__apidocs__ee_featurecollection_randompoints]
# An ee.Geometry to constrain the geographic bounds of random points.
region = ee.Geometry.Rectangle(
    coords=[-113.5, 40.0, -110.2, 41.9], proj='EPSG:4326', geodesic=False
)

# Generate 50 random points with the region.
random_points = ee.FeatureCollection.randomPoints(
    region=region, points=50, seed=0, maxError=1
)

display('Random points from within the defined region', random_points)
m = geemap.Map()
m.set_center(-111.802, 40.979, 7)
m.add_layer(region, {'color': 'yellow'}, 'Region')
m.add_layer(random_points, {'color': 'black'}, 'Random points')
m
# [END earthengine__apidocs__ee_featurecollection_randompoints]
