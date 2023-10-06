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

# [START earthengine__apidocs__ee_imagecollection_count]
# Sentinel-2 image collection for July 2021 intersecting a point of interest.
# Reflectance, cloud probability, and scene classification bands are selected.
col = (
    ee.ImageCollection('COPERNICUS/S2_SR')
    .filterDate('2021-07-01', '2021-08-01')
    .filterBounds(ee.Geometry.Point(-122.373, 37.448))
    .select('B.*|MSK_CLDPRB|SCL')
)

# Visualization parameters for reflectance RGB.
vis_refl = {'bands': ['B11', 'B8', 'B3'], 'min': 0, 'max': 4000}
m = geemap.Map()
m.set_center(-122.373, 37.448, 9)
m.add_ee_layer(col, vis_refl, 'Collection reference', False)

# Reduce the collection to a single image using a variety of methods.
mean = col.mean()
m.add_ee_layer(mean, vis_refl, 'Mean (B11, B8, B3)')

median = col.median()
m.add_ee_layer(median, vis_refl, 'Median (B11, B8, B3)')

min = col.min()
m.add_ee_layer(min, vis_refl, 'Min (B11, B8, B3)')

max = col.max()
m.add_ee_layer(max, vis_refl, 'Max (B11, B8, B3)')

sum = col.sum()
m.add_ee_layer(
    sum, {'bands': ['MSK_CLDPRB'], 'min': 0, 'max': 500}, 'Sum (MSK_CLDPRB)'
)

product = col.product()
m.add_ee_layer(
    product,
    {'bands': ['MSK_CLDPRB'], 'min': 0, 'max': 1e10},
    'Product (MSK_CLDPRB)',
)

# ee.ImageCollection.mode returns the most common value. If multiple mode
# values occur, the minimum mode value is returned.
mode = col.mode()
m.add_ee_layer(
    mode, {'bands': ['SCL'], 'min': 1, 'max': 11}, 'Mode (pixel class)'
)

# ee.ImageCollection.count returns the frequency of valid observations. Here,
# image pixels are masked based on cloud probability to add valid observation
# variability to the collection. Note that pixels with no valid observations
# are masked out of the returned image.
not_cloud_col = col.map(
    lambda img: img.updateMask(img.select('MSK_CLDPRB').lte(10))
)
count = not_cloud_col.count()
m.add_ee_layer(count, {'min': 1, 'max': 5}, 'Count (not cloud observations)')

# ee.ImageCollection.mosaic composites images according to their position in
# the collection (priority is last to first) and pixel mask status, where
# invalid (mask value 0) pixels are filled by preceding valid (mask value >0)
# pixels.
mosaic = not_cloud_col.mosaic()
m.add_ee_layer(mosaic, vis_refl, 'Mosaic (B11, B8, B3)')
m
# [END earthengine__apidocs__ee_imagecollection_count]
