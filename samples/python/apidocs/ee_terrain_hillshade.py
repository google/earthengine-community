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

# [START earthengine__apidocs__ee_terrain_hillshade]
# Demonstrate ee.Terrain functions with single-image and collection DEMs.

# DEMs in Earth Engine are often distributed as single images per asset
# (e.g., NASA/NASADEM_HGT/001) or as collections of tiled images that need
# to be mosaicked (e.g., COPERNICUS/DEM/GLO30). Terrain analysis functions
# compute values based on neighboring pixels, so care must be taken to
# select and prepare DEM inputs appropriately.

# 1. Single DEM image asset.
# Assets like NASADEM are presented as single images covering large areas.
# They generally have a single projection and can be used in terrain analysis
# with no preprocessing.
nasadem = ee.Image('NASA/NASADEM_HGT/001').select('elevation')

# Calculate hillshade: grayscale values representing illumination.
nasadem_hillshade = ee.Terrain.hillshade(nasadem)

# Visualization parameters.
elevation_vis = {
    'min': 0.0,
    'max': 3000.0,
    'palette': [
        '333399',
        '00a2e5',
        '55dd77',
        'ffff99',
        'aa926b',
        'aa928d',
        'ffffff',
    ],
}
hillshade_vis = {'min': 150.0, 'max': 255.0}

# Display layers.
m = geemap.Map()
m.set_center(-121.603, 47.702, 9)
m.add_layer(nasadem, elevation_vis, 'NASADEM Elevation', False)
m.add_layer(nasadem_hillshade, hillshade_vis, 'NASADEM Hillshade')

# 2. Mosaicked DEM ImageCollection asset.
# In contrast to single-image assets like NASADEM, some DEMs like GLO30 are
# provided as a collection of images that need to be mosaicked before use.
# We use this mosaicked DEM for the terrain calculations below.
glo30_collection = ee.ImageCollection('COPERNICUS/DEM/GLO30')

# When mosaicking a DEM collection that will be used for terrain analysis,
# it is best practice to set the mosaic's default projection to the native
# projection of the DEM tiles. If you don't, Earth Engine's default
# projection for mosaics (EPSG:4326 at 1-degree scale) is used, which is
# often too coarse for analysis and can lead to resampling artifacts if
# the result is reprojected to a different CRS during computation.
# See:
# https://developers.google.com/earth-engine/guides/projections#reprojecting
glo30_proj = glo30_collection.first().projection()
glo30_image = (
    glo30_collection.select('DEM').mosaic().setDefaultProjection(glo30_proj)
)

# Calculate hillshade.
glo30_hillshade = ee.Terrain.hillshade(glo30_image)

# Display layers.
m.add_layer(glo30_image, elevation_vis, 'GLO30 Elevation', False)
m.add_layer(glo30_hillshade, hillshade_vis, 'GLO30 Hillshade')
m
# [END earthengine__apidocs__ee_terrain_hillshade]
