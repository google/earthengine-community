# Copyright 2020 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License")
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

"""Google Earth Engine Developer's Guide examples for 'Images - Visualization'."""

# [START earthengine__images043__get_thumb]
# Fetch a digital elevation model.
image = ee.Image('CGIAR/SRTM90_V4')

# Request a default thumbnail of the DEM with defined linear stretch.
# Set masked pixels (ocean) to 1000 so they map as gray.
thumbnail_1 = image.unmask(1000).getThumbURL({
    'min': 0,
    'max': 3000,
    'dimensions': 500,
})
print('Default extent:', thumbnail_1)

# Specify region by rectangle, define palette, set larger aspect dimension size.
thumbnail_2 = image.getThumbURL({
    'min': 0,
    'max': 3000,
    'palette': [
        '00A600',
        '63C600',
        'E6E600',
        'E9BD3A',
        'ECB176',
        'EFC2B3',
        'F2F2F2',
    ],
    'dimensions': 500,
    'region': ee.Geometry.Rectangle([-84.6, -55.9, -32.9, 15.7]),
})
print('Rectangle region and palette:', thumbnail_2)

# Specify region by a linear ring and set display CRS as Web Mercator.
thumbnail_3 = image.getThumbURL({
    'min': 0,
    'max': 3000,
    'palette': [
        '00A600',
        '63C600',
        'E6E600',
        'E9BD3A',
        'ECB176',
        'EFC2B3',
        'F2F2F2',
    ],
    'region': ee.Geometry.LinearRing(
        [[-84.6, 15.7], [-84.6, -55.9], [-32.9, -55.9]]
    ),
    'dimensions': 500,
    'crs': 'EPSG:3857',
})
print('Linear ring region and specified crs:', thumbnail_3)
# [END earthengine__images043__get_thumb]
