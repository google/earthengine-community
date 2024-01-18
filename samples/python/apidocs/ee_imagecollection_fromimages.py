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

# [START earthengine__apidocs__ee_imagecollection_fromimages]
# A series of images.
img1 = ee.Image(0)
img2 = ee.Image(1)
img3 = ee.Image(2)

# Convert the list of images into an image collection.
col = ee.ImageCollection.fromImages([img1, img2, img3])
print('Collection from list of images:', col.getInfo())

# The ee.ImageCollection.fromImages function is intended to coerce the image
# list to a collection when the list is an ambiguous, computed object fetched
# from the properties of a server-side object. For instance, a list
# of images retrieved from a ee.Feature property. Here, we set an image
# list as a property of a feature, retrieve it, and convert it to
# a collection. Notice that the ee.ImageCollection constructor fails to coerce
# the image list to a collection, but ee.ImageCollection.fromImages does.
feature = ee.Feature(None).set('img_list', [img1, img2, img3])
ambiguous_img_list = feature.get('img_list')
print(
    'Coerced to collection:',
    ee.ImageCollection.fromImages(ambiguous_img_list).getInfo(),
)
print(
    'NOT coerced to collection:',
    ee.ImageCollection(ambiguous_img_list).getInfo(),
)

# A common use case is coercing an image list from a saveAll join to a
# image collection, like in this example of building a collection of mean
# annual NDVI images from a MODIS collection.
modis_col = (
    ee.ImageCollection('MODIS/006/MOD13A2')
    .filterDate('2017', '2021')
    .select('NDVI')
    .map(lambda img: img.set('year', img.date().get('year')))
)

distinct_year_col = modis_col.distinct('year')

joined_col = ee.Join.saveAll('img_list').apply(
    primary=distinct_year_col,
    secondary=modis_col,
    condition=ee.Filter.equals(leftField='year', rightField='year'),
)

annual_ndvi_mean = joined_col.map(
    lambda img: ee.ImageCollection.fromImages(img.get('img_list'))
    .mean()
    .copyProperties(img, ['year'])
)
print('Mean annual NDVI collection:', annual_ndvi_mean.getInfo())
# [END earthengine__apidocs__ee_imagecollection_fromimages]
