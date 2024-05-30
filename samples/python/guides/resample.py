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
#   from Resample and ReduceResolution doc.

# [START earthengine__resample__resample]
# Load a Landsat image over San Francisco, California, UAS.
landsat = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20160323')

# Set display and visualization parameters.
m = geemap.Map()
m.set_center(-122.37383, 37.6193, 15)
vis_params = {'bands': ['B4', 'B3', 'B2'], 'max': 0.3}

# Display the Landsat image using the default nearest neighbor resampling.
# when reprojecting to Mercator for the Code Editor map.
m.add_layer(landsat, vis_params, 'original image')

# Force the next reprojection on this image to use bicubic resampling.
resampled = landsat.resample('bicubic')

# Display the Landsat image using bicubic resampling.
m.add_layer(resampled, vis_params, 'resampled')
# [END earthengine__resample__resample]

# Export the images to the WGS84 crs, using both nearest neighbor
# resampling (default) and bicubic resampling for comparison.
# These are Figures 1a and 1b in the docs.

# Export this region, expressed as a polygon.
polygon = ee.Geometry.Polygon([[
    [-122.39233016967773, 37.631464821010745],
    [-122.39245891571045, 37.60631018703994],
    [-122.35263347625732, 37.606344185530936],
    [-122.35246181488037, 37.63136285994676],
]])
task1 = ee.batch.Export.image.toAsset(
    image=landsat.visualize(**vis_params),
    description='resample_original',
    assetId='projects/MY-PROJECT/assets/resample_original',
    scale=5,
    region=polygon,
)
task1.start()
task2 = ee.batch.Export.image.toAsset(
    image=resampled.visualize(**vis_params),
    description='resample_bicubic',
    assetId='projects/MY-PROJECT/assets/resample_bicubic',
    scale=5,
    region=polygon,
)
task2.start()

# [START earthengine__resample__reduce_resolution]
# Load a MODIS EVI image.
modis = ee.Image(ee.ImageCollection('MODIS/006/MOD13A1').first()).select('EVI')

# Display the EVI image near La Honda, California.
m.set_center(-122.3616, 37.5331, 12)
m.add_layer(modis, {'min': 2000, 'max': 5000}, 'MODIS EVI')

# Get information about the MODIS projection.
modis_projection = modis.projection()
display('MODIS projection:', modis_projection)

# Load and display forest cover data at 30 meters resolution.
forest = ee.Image('UMD/hansen/global_forest_change_2015').select(
    'treecover2000'
)
m.add_layer(forest, {'max': 80}, 'forest cover 30 m')

# Get the forest cover data at MODIS scale and projection.
forest_mean = (
    forest
    # Force the next reprojection to aggregate instead of resampling.
    .reduceResolution(reducer=ee.Reducer.mean(), maxPixels=1024)
    # Request the data at the scale and projection of the MODIS image.
    .reproject(crs=modis_projection)
)

# Display the aggregated, reprojected forest cover data.
m.add_layer(forest_mean, {'max': 80}, 'forest cover at MODIS scale')
# [END earthengine__resample__reduce_resolution]

# [START earthengine__resample__reduce_resolution_weights]
# Compute forest area per MODIS pixel.
forest_area = (
    forest.gt(0)
    # Force the next reprojection to aggregate instead of resampling.
    .reduceResolution(reducer=ee.Reducer.mean(), maxPixels=1024)
    # The reduce resolution returns the fraction of the MODIS pixel
    # that's covered by 30 meter forest pixels.  Convert to area
    # after the reduceResolution() call.
    .multiply(ee.Image.pixelArea())
    # Request the data at the scale and projection of the MODIS image.
    .reproject(crs=modis_projection)
)
m.add_layer(forest_area, {'max': 500 * 500}, 'forested area at MODIS scale')
m
# [END earthengine__resample__reduce_resolution_weights]
