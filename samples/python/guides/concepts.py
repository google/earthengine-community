# Copyright 2024 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Earth Engine Developer's Guide examples
#   from 'Concepts' section

# [START earthengine__concepts__client_string]
client_string = 'I am a String'
print(type(client_string))  # str
# [END earthengine__concepts__client_string]

# [START earthengine__concepts__server_string]
server_string = ee.String('I am not a String!')
print(type(server_string))  # ee.ee_string.String
print(
    'Is this an EE object?', isinstance(server_string, ee.ee_string.String)
)  # True
# [END earthengine__concepts__server_string]

# [START earthengine__concepts__print_string]
print(server_string.getInfo())  # I am not a String
# [END earthengine__concepts__print_string]

# [START earthengine__concepts__to_string]
print(server_string)  # ee.String({"constantValue": "I am not a String!"})
# [END earthengine__concepts__to_string]

# [START earthengine__concepts__get_info]
some_string = server_string.getInfo()
strings = some_string + '  Am I?'
print(strings)  # I am not a String!  Am I?
# [END earthengine__concepts__get_info]

# [START earthengine__concepts__for_loop]
client_list = []
for i in range(8):
  client_list.append(i + 1)
print(client_list)
# [END earthengine__concepts__for_loop]

# [START earthengine__concepts__mapped_function]
server_list = ee.List.sequence(0, 7)
server_list = server_list.map(lambda n: ee.Number(n).add(1))
print(server_list.getInfo())
# [END earthengine__concepts__mapped_function]

# [START earthengine__concepts__client_to_server]
to_server_list = ee.List(client_list)
# [END earthengine__concepts__client_to_server]

# [START earthengine__concepts__server_boolean]
my_list = ee.List([1, 2, 3])
server_boolean = my_list.contains(5)
print(server_boolean.getInfo())  # False
# [END earthengine__concepts__server_boolean]

# [START earthengine__concepts__bad_conditional]
if server_boolean:
  client_conditional = True
else:
  client_conditional = False
print('Should be False:', client_conditional)  # True!
# [END earthengine__concepts__bad_conditional]

# [START earthengine__concepts__good_conditional]
server_conditional = ee.Algorithms.If(server_boolean, 'True!', 'False!')
print('Should be False:', server_conditional.getInfo())  # False!
# [END earthengine__concepts__good_conditional]

# [START earthengine__concepts__scripting]
image = ee.Image('CGIAR/SRTM90_V4')
operation = image.add(10)
print(operation)
print(operation.getInfo())
# [END earthengine__concepts__scripting]

# [START earthengine__concepts__scale]
image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318').select('B4')


def print_at_scale(scale):
  display(
      f'Pixel value at {scale} meters scale',
      image.reduceRegion(
          reducer=ee.Reducer.first(),
          geometry=image.geometry().centroid(),
          # The scale determines the pyramid level from which to pull the input
          scale=scale,
      ).get('B4'),
  )


print_at_scale(10)  # 0.10394100844860077
print_at_scale(30)  # 0.10394100844860077
print_at_scale(50)  # 0.09130698442459106
print_at_scale(70)  # 0.1150854229927063
print_at_scale(200)  # 0.102478988468647
print_at_scale(500)  # 0.09072770178318024
# [END earthengine__concepts__scale]

# [START earthengine__concepts__map_scale]
image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')
m = geemap.Map()
m.center_object(image, 17)
m.add_layer(image, {'bands': ['B4', 'B3', 'B2'], 'max': 0.35}, 'image')
m
# [END earthengine__concepts__map_scale]

# [START earthengine__concepts__projection]
image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318').select(0)
display('Projection, crs, and crs_transform:', image.projection())
display('Scale in meters:', image.projection().nominalScale())
# [END earthengine__concepts__projection]

# [START earthengine__concepts__default_projection]
collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
mosaic = collection.filterDate('2018-01-01', '2019-01-01').mosaic()
display(mosaic.projection())
# [END earthengine__concepts__default_projection]

# [START earthengine__concepts__reproject_mock]
# Some projection that is suitable for your area of interest.
proj = ee.Projection(...)
output = collection.reduce(...).reproject(proj)
# [END earthengine__concepts__reproject_mock]

# [START earthengine__concepts__projections1]
# The input image has a SR-ORG:6974 (sinusoidal) projection.
image = ee.Image('MODIS/061/MOD13A1/2014_05_09').select(0)

# Normalize the image and add it to the map.
rescaled = image.unitScale(-2000, 10000)
vis_params = {'min': 0.15, 'max': 0.7}
m = geemap.Map()
m.add_layer(rescaled, vis_params, 'Rescaled')
m
# [END earthengine__concepts__projections1]

# [START earthengine__concepts__reproject]
# The input image has a SR-ORG:6974 (sinusoidal) projection.
image = ee.Image('MODIS/061/MOD13A1/2014_05_09').select(0)

# Operations *before* the reproject call will be done in the projection
# specified by reproject(). The output results in another reprojection.
reprojected = image.unitScale(-2000, 10000).reproject('EPSG:4326', None, 500)
m = geemap.Map()
m.add_layer(reprojected, {'min': 0.15, 'max': 0.7}, 'Reprojected')
m
# [END earthengine__concepts__reproject]
