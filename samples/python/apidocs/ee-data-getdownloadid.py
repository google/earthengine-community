# Copyright 2021 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_data_getdownloadid]
"""Demonstrates the ee.data.getDownloadId method."""

import io
import requests
import ee


ee.Authenticate()
ee.Initialize()

# A Sentinel-2 surface reflectance image.
img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG')

# A small region within the image.
region = ee.Geometry.BBox(-122.0859, 37.0436, -122.0626, 37.0586)

# Image chunk as a NumPy structured array.
import numpy
download_id = ee.data.getDownloadId({
    'image': img,
    'bands': ['B3', 'B8', 'B11'],
    'region': region,
    'scale': 20,
    'format': 'NPY'
})
response = requests.get(ee.data.makeDownloadUrl(download_id))
data = numpy.load(io.BytesIO(response.content))
print(data)
print(data.dtype)

# Single-band GeoTIFF files wrapped in a zip file.
download_id = ee.data.getDownloadId({
    'image': img,
    'name': 'single_band',
    'bands': ['B3', 'B8', 'B11'],
    'region': region
})
response = requests.get(ee.data.makeDownloadUrl(download_id))
with open('single_band.zip', 'wb') as fd:
  fd.write(response.content)

# Multi-band GeoTIFF file wrapped in a zip file.
download_id = ee.data.getDownloadId({
    'image': img,
    'name': 'multi_band',
    'bands': ['B3', 'B8', 'B11'],
    'region': region,
    'scale': 20,
    'filePerBand': False
})
response = requests.get(ee.data.makeDownloadUrl(download_id))
with open('multi_band.zip', 'wb') as fd:
  fd.write(response.content)

# Band-specific transformations.
download_id = ee.data.getDownloadId({
    'image': img,
    'name': 'custom_single_band',
    'bands': [
        {'id': 'B3', 'scale': 10},
        {'id': 'B8', 'scale': 10},
        {'id': 'B11', 'scale': 20}
    ],
    'region': region
})
response = requests.get(ee.data.makeDownloadUrl(download_id))
with open('custom_single_band.zip', 'wb') as fd:
  fd.write(response.content)

# Multi-band GeoTIFF file.
download_id = ee.data.getDownloadId({
    'image': img,
    'bands': ['B3', 'B8', 'B11'],
    'region': region,
    'scale': 20,
    'format': 'GEO_TIFF'
})
response = requests.get(ee.data.makeDownloadUrl(download_id))
with open('multi_band.tif', 'wb') as fd:
  fd.write(response.content)
# [END earthengine__apidocs__ee_data_getdownloadid]
