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

# [START earthengine__apidocs__ee_image_loadgeotiff]
uri = (
    'gs://gcp-public-data-landsat/'
    + 'LC08/01/001/002/'
    + 'LC08_L1GT_001002_20160817_20170322_01_T2/'
    + 'LC08_L1GT_001002_20160817_20170322_01_T2_B5.TIF'
)
cloud_image = ee.Image.loadGeoTIFF(uri)

display(cloud_image)

m = geemap.Map()
m.add_layer(cloud_image, {'min': 0, 'max': 20000})
m.center_object(cloud_image, 6)
m
# [END earthengine__apidocs__ee_image_loadgeotiff]
