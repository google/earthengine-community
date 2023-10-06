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

# [START earthengine__apidocs__ee_imagecollection_reducetoimage]
col = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterBounds(ee.Geometry.BBox(-124.0, 43.2, -116.5, 46.3))
    .filterDate('2021', '2022')
)

# Image visualization settings.
vis_params = {'bands': ['B4', 'B3', 'B2'], 'min': 0.01, 'max': 0.25}
m = geemap.Map()
m.add_ee_layer(col.mean(), vis_params, 'RGB mean')

# Reduce the geometry (footprint) of images in the collection to an image.
# Image property values are applied to the pixels intersecting each
# image's geometry and then a per-pixel reduction is performed according
# to the selected reducer. Here, the image cloud cover property is assigned
# to the pixels intersecting image geometry and then reduced to a single
# image representing the per-pixel mean image cloud cover.
mean_cloud_cover = col.reduceToImage(
    properties=['CLOUD_COVER'], reducer=ee.Reducer.mean()
)

m.set_center(-119.87, 44.76, 6)
m.add_ee_layer(mean_cloud_cover, {'min': 0, 'max': 50}, 'Cloud cover mean')
m
# [END earthengine__apidocs__ee_imagecollection_reducetoimage]
