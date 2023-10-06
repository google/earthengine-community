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

# [START earthengine__apidocs__ee_terrain_aspect]
# A digital elevation model.
dem = ee.Image('NASA/NASADEM_HGT/001').select('elevation')

# Calculate slope. Units are degrees, range is [0,90).
slope = ee.Terrain.slope(dem)

# Calculate aspect. Units are degrees where 0=N, 90=E, 180=S, 270=W.
aspect = ee.Terrain.aspect(dem)

# Display slope and aspect layers on the map.
m = geemap.Map()
m.set_center(-123.457, 47.815, 11)
m.add_ee_layer(slope, {'min': 0, 'max': 89.99}, 'Slope')
m.add_ee_layer(aspect, {'min': 0, 'max': 359.99}, 'Aspect')

# Use the ee.Terrain.products function to calculate slope, aspect, and
# hillshade simultaneously. The output bands are appended to the input image.
# Hillshade is calculated based on illumination azimuth=270, elevation=45.
terrain = ee.Terrain.products(dem)
display('ee.Terrain.products bands', terrain.bandNames())
m.add_ee_layer(terrain.select('hillshade'), {'min': 0, 'max': 255}, 'Hillshade')
m
# [END earthengine__apidocs__ee_terrain_aspect]
