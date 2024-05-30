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
#   from 'Creating Feature Collections' page.

# [START earthengine__features03__from_list]
# Make a list of Features.
features = [
    ee.Feature(
        ee.Geometry.Rectangle(30.01, 59.80, 30.59, 60.15), {'name': 'Voronoi'}
    ),
    ee.Feature(ee.Geometry.Point(-73.96, 40.781), {'name': 'Thiessen'}),
    ee.Feature(ee.Geometry.Point(6.4806, 50.8012), {'name': 'Dirichlet'}),
]

# Create a FeatureCollection from the list and print it.
from_list = ee.FeatureCollection(features)
display(from_list)
# [END earthengine__features03__from_list]

# [START earthengine__features03__from_geom]
# Create a FeatureCollection from a single geometry and print it.
from_geom = ee.FeatureCollection(ee.Geometry.Point(16.37, 48.225))
display(from_geom)
# [END earthengine__features03__from_geom]

# [START earthengine__features03__from_asset]
fc = ee.FeatureCollection('RESOLVE/ECOREGIONS/2017')
m = geemap.Map()
m.set_center(12.17, 20.96, 3)
m.add_layer(fc, {}, 'ecoregions')
display(m)
# [END earthengine__features03__from_asset]

# [START earthengine__features03__random]
# Define an arbitrary region in which to compute random points.
region = ee.Geometry.Rectangle(-119.224, 34.669, -99.536, 50.064)

# Create 1000 random points in the region.
random_points = ee.FeatureCollection.randomPoints(region)

# Display the points.
m = geemap.Map()
m.center_object(random_points)
m.add_layer(random_points, {}, 'random points')
display(m)
# [END earthengine__features03__random]
