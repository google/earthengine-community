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

"""Earth Engine Developer's Guide examples from 'Images - Image information' page."""

import ee
ee.Initialize()

# [START earthengine__images01__image_info]
# Load an image.
image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318')

# Get information about the bands as a list.
band_names = image.bandNames()
print('Band names: ', band_names.getInfo())  # ee.List of band names

# Get projection information from band 1.
b1_proj = image.select('B1').projection()
print('Band 1 projection: ', b1_proj.getInfo())  # ee.Projection object

# Get scale (in meters) information from band 1.
b1_scale = image.select('B1').projection().nominalScale()
print('Band 1 scale: ', b1_scale.getInfo())  # ee.Number

# Note that different bands can have different projections and scale.
b8_scale = image.select('B8').projection().nominalScale()
print('Band 8 scale: ', b8_scale.getInfo())  # ee.Number

# Get a list of all metadata properties.
properties = image.propertyNames()
print('Metadata properties: ',
      properties.getInfo())  # ee.List of metadata properties

# Get a specific metadata property.
cloudiness = image.get('CLOUD_COVER')
print('CLOUD_COVER: ', cloudiness.getInfo())  # ee.Number

# Get the timestamp and convert it to a date.
date = ee.Date(image.get('system:time_start'))
print('Timestamp: ', date.getInfo())  # ee.Date
# [END earthengine__images01__image_info]
