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

# [START earthengine__apidocs__ee_imagecollection_sort]
# A Landsat 8 TOA image collection (2 months of images at a specific point).
col = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterBounds(ee.Geometry.Point(-90.70, 34.71))
    .filterDate('2020-07-01', '2020-09-01')
)
display('Collection', col)

# Sort the collection in ASCENDING order of image cloud cover.
col_cld_sort_asc = col.sort('CLOUD_COVER')
display('Cloud cover ascending', col_cld_sort_asc)

# Display the image with the least cloud cover.
vis_params = {'bands': ['B4', 'B3', 'B2'], 'min': 0.01, 'max': 0.25}
m = geemap.Map()
m.set_center(-90.70, 34.71, 9)
m.add_layer(col_cld_sort_asc.first(), vis_params, 'Least cloudy')

# Sort the collection in DESCENDING order of image cloud cover.
col_cld_sort_desc = col.sort('CLOUD_COVER', False)
display('Cloud cover descending', col_cld_sort_desc)

# Display the image with the most cloud cover.
m.add_layer(col_cld_sort_desc.first(), vis_params, 'Most cloudy')
m
# [END earthengine__apidocs__ee_imagecollection_sort]
