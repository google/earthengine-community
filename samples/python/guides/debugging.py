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


#  Earth Engine Developer's Guide examples
#   from 'Debugging' page.
# [START earthengine__debugging__client_logic]
# Load a Sentinel-2 image.
image = ee.Image('USGS/SRTMGL1_003')

# NameError: name 'band_names' is not defined.
display = image.visualize(bands=band_names, min=0, max=9000)

# AttributeError: 'Image' object has no attribute 'selfAnalyze'.
silly = image.selfAnalyze()
# [END earthengine__debugging__client_logic]

# [START earthengine__debugging__cast]
collection = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')

# AttributeError: 'Element' object has no attribute 'area'.
area = collection.first().area()
# [END earthengine__debugging__cast]

# [START earthengine__debugging__cast_corrected]
area = ee.Feature(collection.first()).area()
# [END earthengine__debugging__cast_corrected]

# [START earthengine__debugging__tricky]
# Don't mix EE objects and Python objects.
image = ee.Image('USGS/SRTMGL1_003')
nonsense = image + 2

# TypeError: unsupported operand type(s) for +: 'Image' and 'int'.
display(nonsense)

# TypeError: unsupported operand type(s) for +: 'Image' and 'int'.
m = geemap.Map()
m.add_layer(nonsense)
m
# [END earthengine__debugging__tricky]

# [START earthengine__debugging__tricky_corrected]
m = geemap.Map()
m.add_layer(image.add(2))
m
# [END earthengine__debugging__tricky_corrected]

# [START earthengine__debugging__server_error]
# Load a Sentinel-2 image.
s2image = ee.Image(
    'COPERNICUS/S2_HARMONIZED/20160625T100617_20160625T170310_T33UVR'
)

# EEException: Image.select: Band pattern 'non_band' did not match any bands.
print(s2image.select(['non_band']).getInfo())
# [END earthengine__debugging__server_error]

# [START earthengine__debugging__result_capture]
s2image = ee.Image(
    'COPERNICUS/S2_HARMONIZED/20160625T100617_20160625T170310_T33UVR'
)
s2image.set('my_property', 'This image is not assigned to a variable')

# This will not result in an error, but will not find 'my_property'.
display(s2image.get('my_property'))  # None
# [END earthengine__debugging__result_capture]

# [START earthengine__debugging__result_capture_corrected]
s2image = s2image.set('my_property', 'OK')
display(s2image.get('my_property'))  # OK
# [END earthengine__debugging__result_capture_corrected]

# [START earthengine__debugging__mapped_function1]
collection = ee.ImageCollection('MODIS/006/MOD44B')

# Error: A mapped function's arguments cannot be used in client-side operations.
bad_map_3 = collection.map(lambda image: print(image.getInfo()))
# [END earthengine__debugging__mapped_function1]

# [START earthengine__debugging__mapped_function2]
collection = ee.ImageCollection('MODIS/006/MOD44B')

# Error: User-defined methods must return a value.
bad_map_1 = collection.map(lambda image: None)
# [END earthengine__debugging__mapped_function2]

# [START earthengine__debugging__mapped_function3]
collection = ee.ImageCollection('MODIS/006/MOD44B')

bad_map_2 = collection.map(lambda image: image.date())

# EEException: Collection.map:
# A mapped algorithm must return a Feature or Image.
print(bad_map_2.getInfo())
# [END earthengine__debugging__mapped_function3]

# [START earthengine__debugging__mapped_function4]
collection = ee.ImageCollection('MODIS/006/MOD44B')

ok_map_2 = collection.map(lambda image: image.set('date', image.date()))
print(ok_map_2.getInfo())

# Get a list of the dates.
dates_list = ok_map_2.aggregate_array('date')
print(dates_list.getInfo())
# [END earthengine__debugging__mapped_function4]

# [START earthengine__debugging__absurd_computation]
absurd_computation = ee.Image(1).reduceRegion(
    reducer='count',
    geometry=ee.Geometry.Rectangle([-180, -90, 180, 90], None, False),
    scale=100,
)

# EEException: Image.reduceRegion: Too many pixels in the region.
#        Found 80300348117, but only 10000000 allowed.
print(absurd_computation.getInfo())
# [END earthengine__debugging__absurd_computation]

# [START earthengine__debugging__ridiculous_computation]
ridiculous_computation = ee.Image(1).reduceRegion(
    reducer='count',
    geometry=ee.Geometry.Rectangle([-180, -90, 180, 90], None, False),
    scale=100,
    maxPixels=int(1e11),
)

# Error: Computation timed out.
print(ridiculous_computation.getInfo())
# [END earthengine__debugging__ridiculous_computation]

# [START earthengine__debugging__ridiculous_computation_solution]
task = ee.batch.Export.table.toDrive(
    collection=ee.FeatureCollection([ee.Feature(None, ridiculous_computation)]),
    description='ridiculous_computation',
    fileFormat='CSV',
)
# task.start()
# [END earthengine__debugging__ridiculous_computation_solution]

# [START earthengine__debugging__terrible_aggregations]
collection = ee.ImageCollection('LANDSAT/LT05/C02/T1').filterBounds(
    ee.Geometry.Point([-123, 43])
)


def apply_mean_aggregation(image):
  return image.set(
      image.reduceRegion(
          reducer='mean',
          geometry=image.geometry(),
          scale=30,
          maxPixels=int(1e9),
      )
  )


terrible_aggregations = collection.map(apply_mean_aggregation)

# EEException: Computation timed out.
print(terrible_aggregations.getInfo())
# [END earthengine__debugging__terrible_aggregations]

# [START earthengine__debugging__terrible_aggregations_solution]
task = ee.batch.Export.table.toDrive(
    collection=terrible_aggregations,
    description='terrible_aggregations',
    fileFormat='CSV',
)
# task.start()
# [END earthengine__debugging__terrible_aggregations_solution]

# [START earthengine__debugging__memory_hog]
bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']
memory_hog = (
    ee.ImageCollection('LANDSAT/LT05/C02/T1')
    .select(bands)
    .toArray()
    .arrayReduce(ee.Reducer.mean(), [0])
    .arrayProject([1])
    .arrayFlatten([bands])
    .reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=ee.Geometry.Point([-122.27, 37.87]).buffer(1000),
        scale=1,
        bestEffort=True,
    )
)

# EEException: User memory limit exceeded.
print(memory_hog.getInfo())
# [END earthengine__debugging__memory_hog]

# [START earthengine__debugging__memory_hog_solution1]
bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']
smaller_hog = (
    ee.ImageCollection('LANDSAT/LT05/C02/T1')
    .select(bands)
    .toArray()
    .arrayReduce(ee.Reducer.mean(), [0])
    .arrayProject([1])
    .arrayFlatten([bands])
    .reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=ee.Geometry.Point([-122.27, 37.87]).buffer(1000),
        scale=1,
        bestEffort=True,
        tileScale=16,
    )
)

print(smaller_hog.getInfo())
# [END earthengine__debugging__memory_hog_solution1]

# [START earthengine__debugging__memory_hog_solution2]
bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']
ok_memory = (
    ee.ImageCollection('LANDSAT/LT05/C02/T1')
    .select(bands)
    .mean()
    .reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=ee.Geometry.Point([-122.27, 37.87]).buffer(1000),
        scale=1,
        bestEffort=True,
    )
)

print(ok_memory.getInfo())
# [END earthengine__debugging__memory_hog_solution2]

# [START earthengine__debugging__aside]
image = ee.Image(
    ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterBounds(ee.Geometry.Point([-12.29, 168.83]))
    .aside(display)
    .filterDate('2011-01-01', '2016-12-31')
    .first()
)
# [END earthengine__debugging__aside]

# [START earthengine__debugging__aside_composite]
m = geemap.Map()
m.set_center(106.91, 47.91, 11)

composite = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterBounds(ee.Geometry.Point([106.91, 47.91]))
    .map(lambda image: image.addBands(image.normalizedDifference(['B5', 'B4'])))
    .aside(m.add_layer, {'bands': ['B4', 'B3', 'B2'], 'max': 0.3}, 'collection')
    .qualityMosaic('nd')
)

m.add_layer(composite, {'bands': ['B4', 'B3', 'B2'], 'max': 0.3}, 'composite')
m
# [END earthengine__debugging__aside_composite]

# [START earthengine__debugging__map_problem]
image = ee.Image(
    'COPERNICUS/S2_HARMONIZED/20150821T111616_20160314T094808_T30UWU'
)

some_features = ee.FeatureCollection([
    ee.Feature(ee.Geometry.Point([-2.02, 48.43])),
    ee.Feature(ee.Geometry.Point([-2.80, 48.37])),
    ee.Feature(ee.Geometry.Point([-1.22, 48.29])),
    ee.Feature(ee.Geometry.Point([-1.73, 48.65])),
])


# Define a function to be mapped over the collection.
def function_to_map(feature):
  dictionary = image.reduceRegion(
      reducer=ee.Reducer.first(), geometry=feature.geometry(), scale=10
  )

  return feature.set(
      {'result': ee.Number(dictionary.get('B5')).divide(dictionary.get('B4'))}
  )


problem = some_features.map(function_to_map)

# EEException: Error in map(ID=2):
#  Number.divide: Parameter 'left' is required.
print(problem.getInfo())
# [END earthengine__debugging__map_problem]


# [START earthengine__debugging__refactor]
# Define a function to be mapped over the collection.
def function_to_map(feature):
  dictionary = image.reduceRegion(
      reducer=ee.Reducer.first(), geometry=feature.geometry(), scale=10
  )

  # Debug:
  display(dictionary)

  return feature.set(
      {'result': ee.Number(dictionary.get('B5')).divide(dictionary.get('B4'))}
  )


# Isolate the feature that's creating problems.
bad_feature = ee.Feature(
    some_features.filter(ee.Filter.eq('system:index', '2')).first()
)

# Test the function with print statements added.
function_to_map(bad_feature)

# Inspect the bad feature in relation to the image.
m = geemap.Map()
m.center_object(bad_feature, 11)
m.add_layer(bad_feature, {}, 'bad feature')
m.add_layer(image, {'bands': ['B4', 'B3', 'B2'], 'max': 3000}, 'image')
m
# [END earthengine__debugging__refactor]


# [START earthengine__debugging__fixed]
def function_to_map(feature):
  dictionary = image.reduceRegion(
      reducer=ee.Reducer.first(), geometry=feature.geometry(), scale=10
  )

  return feature.set(
      {'result': ee.Number(dictionary.get('B5')).divide(dictionary.get('B4'))}
  )


no_problem = some_features.filterBounds(image.geometry()).map(function_to_map)

display(no_problem)
# [END earthengine__debugging__fixed]
