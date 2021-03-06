# Copyright 2020 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Google Earth Engine Developer's Guide examples for 'Images - Creating images'."""

# [START earthengine__images02__load_image]
loaded_image = ee.Image('JAXA/ALOS/AW3D30/V2_2')
# [END earthengine__images02__load_image]

# [START earthengine__images02__find_image]
first = (ee.ImageCollection('COPERNICUS/S2_SR')
         .filterBounds(ee.Geometry.Point(-70.48, 43.3631))
         .filterDate('2019-01-01', '2019-12-31')
         .sort('CLOUDY_PIXEL_PERCENTAGE')
         .first())

# Define a map centered on southern Maine.
map_s2 = folium.Map(location=[43.7516, -70.8155], zoom_start=11)

# Add the image layer to the map and display it.
map_s2.add_ee_layer(
    first, {'bands': ['B4', 'B3', 'B2'], 'min': 0, 'max': 2000}, 'first')
display(map_s2)
# [END earthengine__images02__find_image]

# [START earthengine__images02__cloud_image]
uri = ('gs://gcp-public-data-landsat/LC08/01/001/002/'
       'LC08_L1GT_001002_20160817_20170322_01_T2/'
       'LC08_L1GT_001002_20160817_20170322_01_T2_B5.TIF')
cloud_image = ee.Image.loadGeoTIFF(uri)
print(cloud_image.getInfo())
# [END earthengine__images02__cloud_image]

# [START earthengine__images02__create_image]
from pprint import pprint

print('Create a constant image:')
image_1 = ee.Image(1)
pprint(image_1.getInfo())

print('\nConcatenate two images into one multi-band image:')
image_2 = ee.Image(2)
image_3 = ee.Image.cat([image_1, image_2])
pprint(image_3.getInfo())

print('\nCreate a multi-band image from a list of constants:')
multiband = ee.Image([1, 2, 3])
pprint(multiband.getInfo())

print('\nSelect and (optionally) rename bands:')
renamed = multiband.select(
    ['constant', 'constant_1', 'constant_2'],  # old names
    ['band1', 'band2', 'band3'])               # new names
pprint(renamed.getInfo())

print('\nAdd bands to an image:')
image_4 = image_3.addBands(ee.Image(42))
pprint(image_4.getInfo())
# [END earthengine__images02__create_image]
