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

# [START earthengine__apidocs__ee_data_getpixels]
# Region of interest.
coords = [
    -121.58626826832939,
    38.059141484827485,
]
region = ee.Geometry.Point(coords)

# Get a Sentinel-2 image.
image = (ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(region)
  .filterDate('2020-04-01', '2020-09-01')
  .sort('CLOUD_COVERAGE_ASSESSMENT')
  .first())
image_id = image.getInfo()['id']

# Make a projection to discover the scale in degrees.
proj = ee.Projection('EPSG:4326').atScale(10).getInfo()

# Get scales out of the transform.
scale_x = proj['transform'][0]
scale_y = -proj['transform'][4]

# Make a request object.
request = {
    'assetId': image_id,
    'fileFormat': 'PNG',
    'bandIds': ['B4', 'B3', 'B2'],
    'grid': {
        'dimensions': {
            'width': 640,
            'height': 640
        },
        'affineTransform': {
            'scaleX': scale_x,
            'shearX': 0,
            'translateX': coords[0],
            'shearY': 0,
            'scaleY': scale_y,
            'translateY': coords[1]
        },
        'crsCode': proj['crs'],
    },
    'visualizationOptions': {'ranges': [{'min': 0, 'max': 3000}]},
}

image_png = ee.data.getPixels(request)
# Do something with the image...
# [END earthengine__apidocs__ee_data_getpixels]
