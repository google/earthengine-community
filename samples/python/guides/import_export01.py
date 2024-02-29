# Copyright 2024 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Earth Engine Developer's Guide examples from 'Import and Export data' section"""

# [START earthengine__import_export01__export_setup]
# Load a landsat image and select three bands.
landsat = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_123032_20140515').select(
    ['B4', 'B3', 'B2']
)

# Create a geometry representing an export region.
geometry = ee.Geometry.Rectangle([116.2621, 39.8412, 116.4849, 40.01236])
# [END earthengine__import_export01__export_setup]

# [START earthengine__import_export01__export_projection]
# Retrieve the projection information from a band of the original image.
# Call getInfo() on the projection to request a client-side object containing
# the crs and transform information needed for the client-side Export function.
projection = landsat.select('B2').projection().getInfo()
# [END earthengine__import_export01__export_projection]

# [START earthengine__import_export01__export_image]
# Export the image, specifying the CRS, transform, and region.
task = ee.batch.Export.image.toDrive(
    image=landsat,
    description='imageToDriveExample_transform',
    crs=projection['crs'],
    crsTransform=projection['transform'],
    region=geometry,
)
task.start()
# [END earthengine__import_export01__export_image]

# [START earthengine__import_export01__export_cogeo]
# Export a cloud-optimized GeoTIFF.
task = ee.batch.Export.image.toDrive(
    image=landsat,
    description='imageToCOGeoTiffExample',
    crs=projection['crs'],
    crsTransform=projection['transform'],
    region=geometry,
    fileFormat='GeoTIFF',
    formatOptions={'cloudOptimized': True},
)
task.start()
# [END earthengine__import_export01__export_cogeo]

# [START earthengine__import_export01__export_nodata]
# Set a nodata value and replace masked pixels around the image edge with it.
no_data_val = -9999
landsat = landsat.unmask(no_data_val)

task = ee.batch.Export.image.toDrive(
    image=landsat,
    description='imageNoDataExample',
    crs=projection['crs'],
    scale=2000,  # large scale for minimal demo
    region=landsat.geometry(),  # full image bounds
    fileFormat='GeoTIFF',
    formatOptions={'noData': no_data_val},
)
task.start()
# [END earthengine__import_export01__export_nodata]

# [START earthengine__import_export01__image_to_cloud]
# Export the image to Cloud Storage.
task = ee.batch.Export.image.toCloudStorage(
    image=landsat,
    description='imageToCloudExample',
    bucket='your-bucket-name',
    fileNamePrefix='exampleExport',
    crs=projection['crs'],
    crsTransform=projection['transform'],
    region=geometry,
)
task.start()
# [END earthengine__import_export01__image_to_cloud]

# [START earthengine__import_export01__image_to_asset]
# Get band 4 from the Landsat image, copy it.
band_4 = (
    landsat.select('B4')
    .rename('b4_mean')
    .addBands(landsat.select('B4').rename('b4_sample'))
    .addBands(landsat.select('B4').rename('b4_max'))
)

# Export the image to an Earth Engine asset.
task = ee.batch.Export.image.toAsset(
    image=band_4,
    description='imageToAssetExample',
    assetId='projects/your-project/assets/exampleExport',
    crs=projection['crs'],
    crsTransform=projection['transform'],
    region=geometry,
    pyramidingPolicy={
        'b4_mean': 'mean',
        'b4_sample': 'sample',
        'b4_max': 'max',
    },
)
task.start()
# [END earthengine__import_export01__image_to_asset]

m = geemap.Map()
m.add_layer(landsat, {'bands': ['B4', 'B3', 'B2'], 'max': 0.4, 'gamma': 1.2})
display(m)

# [START earthengine__import_export01__export_vectors]
# Make a collection of points.
features = ee.FeatureCollection([
    ee.Feature(ee.Geometry.Point(30.41, 59.933), {'name': 'Voronoi'}),
    ee.Feature(ee.Geometry.Point(-73.96, 40.781), {'name': 'Thiessen'}),
    ee.Feature(ee.Geometry.Point(6.4806, 50.8012), {'name': 'Dirichlet'}),
])

# Export the FeatureCollection to a KML file.
task = ee.batch.Export.table.toDrive(
    collection=features, description='vectorsToDriveExample', fileFormat='KML'
)
task.start()
# [END earthengine__import_export01__export_vectors]

# [START earthengine__import_export01__vectors_to_cloud]
# Export a KML file to Cloud Storage.
task = ee.batch.Export.table.toCloudStorage(
    collection=features,
    description='vectorsToCloudStorageExample',
    bucket='your-bucket-name',
    fileNamePrefix='exampleTableExport',
    fileFormat='KML',
)
task.start()
# [END earthengine__import_export01__vectors_to_cloud]

# [START earthengine__import_export01__export_table_asset]
# Export an ee.FeatureCollection as an Earth Engine asset.
task = ee.batch.Export.table.toAsset(
    collection=features,
    description='exportToTableAssetExample',
    assetId='projects/your-project/assets/exampleAssetId',
)
task.start()
# [END earthengine__import_export01__export_table_asset]


# [START earthengine__import_export01__export_table]
# Load a Landsat image.
image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')
projection = image.select('B2').projection().getInfo()

# Create an arbitrary rectangle.
region = ee.Geometry.Rectangle(-122.2806, 37.1209, -122.0554, 37.2413)

# Get a dictionary of means in the region.
means = image.reduceRegion(
    reducer=ee.Reducer.mean(),
    geometry=region,
    crs=projection['crs'],
    crsTransform=projection['transform'],
)

# Make a feature without geometry and set the properties to the dictionary of means.
feature = ee.Feature(None, means)

# Wrap the Feature in a FeatureCollection for export.
feature_collection = ee.FeatureCollection([feature])

# Export the FeatureCollection.
task = ee.batch.Export.table.toDrive(
    collection=feature_collection,
    description='exportTableExample',
    fileFormat='CSV',
)
task.start()
# [END earthengine__import_export01__export_table]

# [START earthengine__import_export01__export_map]
# Load the global Accessibility to Cities image.
accessibility = ee.Image('Oxford/MAP/accessibility_to_cities_2015_v1_0')

# Color palette for visualizing accessibility data.
accessibility_palette = [
    'f2fef8',
    'defce1',
    'c9f3bc',
    'cbeca7',
    'd6e793',
    'e2d87b',
    'd4a561',
    'c46c49',
    'ab3a38',
    '922f4b',
    '7d285d',
    '672069',
    '3a1453',
    '1b0c3c',
    '050526',
    '00030f',
    '000000',
]

# Apply the color palette to the log of travel time.
log_accessibility = accessibility.where(
    accessibility.gt(0), accessibility.log()
)
accessibility_rgb = log_accessibility.visualize(
    min=0, max=10, palette=accessibility_palette
)

# Composite onto a solid-color background to fill in the oceans.
background = ee.Image(0).visualize(palette=['11101e'])
accessibility_blended = background.blend(accessibility_rgb).updateMask(1)

# Check the visualization.
m = geemap.Map()
m.add_layer(accessibility_blended, {}, 'accessibility_blended')

# Define an export region.
export_region = ee.Geometry.Rectangle([34, -3, 40, 1])
m.center_object(export_region)
m.add_layer(export_region, {}, 'export_region')
display(m)

# Export the visualization image as map tiles.
task = ee.batch.Export.map.toCloudStorage(
    # All tiles that intersect the region get exported in their entirety.
    # Clip the image to prevent low resolution tiles from appearing outside
    # of the region.
    image=accessibility_blended.clip(export_region),
    description='mapToCloudExample',
    bucket='your-bucket-name',
    maxZoom=13,
    region=export_region,
)
task.start()
# [END earthengine__import_export01__export_map]
