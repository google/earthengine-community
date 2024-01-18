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

# [START earthengine__apidocs__ee_imagecollection_size]
# Note: ee.ImageCollection.size may take a lot of time and memory to run,
# since it must generate all of the results in order to count them. Large
# collections and/or complex computations can produce memory limitation
# errors.

# A Landsat 8 TOA image collection (1 year of images at a specific point).
col = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA').filterBounds(
    ee.Geometry.Point(-90.70, 34.71)
    ).filterDate('2020-01-01', '2021-01-01')

# Get the number of images in the collection.
print('Number of images', col.size().getInfo())
# [END earthengine__apidocs__ee_imagecollection_size]
