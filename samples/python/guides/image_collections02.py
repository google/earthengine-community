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

"""Earth Engine Developer's Guide examples from 'Creating Image Collections' page."""

# [START earthengine__image_collections02__load_collection]
sentinel_collection = ee.ImageCollection('COPERNICUS/S2_SR')
# [END earthengine__image_collections02__load_collection]

# [START earthengine__image_collections02__creating_collections]
# Create arbitrary constant images.
constant_1 = ee.Image(1)
constant_2 = ee.Image(2)

# Create a collection by giving a list to the constructor.
collection_from_constructor = ee.ImageCollection([constant_1, constant_2])
display('Collection from constructor:', collection_from_constructor)

# Create a collection with fromImages().
collection_from_images = ee.ImageCollection.fromImages(
    [ee.Image(3), ee.Image(4)]
)
display('Collection from images:', collection_from_images)

# Merge two collections.
merged_collection = collection_from_constructor.merge(collection_from_images)
display('Merged collection:', merged_collection)

# Create a toy FeatureCollection
features = ee.FeatureCollection(
    [ee.Feature(None, {'foo': 1}), ee.Feature(None, {'foo': 2})]
)

# Create an ImageCollection from the FeatureCollection
# by mapping a function over the FeatureCollection.
images = features.map(lambda feature: ee.Image(ee.Number(feature.get('foo'))))

# Display the resultant collection.
display('Image collection:', images)
# [END earthengine__image_collections02__creating_collections]

# [START earthengine__image_collections02__cloud_collections]
# All the GeoTiffs are in this folder.
uri_base = (
    'gs://gcp-public-data-landsat/LC08/01/001/002/'
    + 'LC08_L1GT_001002_20160817_20170322_01_T2/'
)

# List of URIs, one for each band.
uris = ee.List([
    uri_base + 'LC08_L1GT_001002_20160817_20170322_01_T2_B2.TIF',
    uri_base + 'LC08_L1GT_001002_20160817_20170322_01_T2_B3.TIF',
    uri_base + 'LC08_L1GT_001002_20160817_20170322_01_T2_B4.TIF',
    uri_base + 'LC08_L1GT_001002_20160817_20170322_01_T2_B5.TIF',
])

# Make a collection from the list of images.
images = uris.map(lambda uri: ee.Image.loadGeoTIFF(uri))
collection = ee.ImageCollection(images)

# Get an RGB image from the collection of bands.
rgb = collection.toBands().rename(['B2', 'B3', 'B4', 'B5'])
m = geemap.Map()
m.center_object(rgb)
m.add_layer(rgb, {'bands': ['B4', 'B3', 'B2'], 'min': 0, 'max': 20000}, 'rgb')
m
# [END earthengine__image_collections02__cloud_collections]
