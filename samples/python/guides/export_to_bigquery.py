# Copyright 2024 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Earth Engine Developer's Guide examples from 'Exporting to BigQuery' page."""

# [START earthengine__bq-export__json]
states = ee.FeatureCollection('TIGER/2018/States')
mod11a1 = ee.ImageCollection('MODIS/061/MOD11A1')

# Find the max day and night temperatures per pixel for a given time.
max_temp = (
    mod11a1.select(['LST_Day_1km', 'LST_Night_1km'])
    .filterDate('2023-05-15', '2023-05-25')
    .max()
)


def get_max_temp_for_state(e):
  max_temp_dict = max_temp.reduceRegion(
      reducer=ee.Reducer.max(),
      geometry=e.geometry(),
      scale=10 * 1000,  # 10 km
  )
  # Convert the dictionary to JSON and add it as a property.
  return e.set('maxTemp', ee.String.encodeJSON(max_temp_dict))


# Annotate each state with its max day/night temperatures.
annotated_states = states.map(get_max_temp_for_state)

task = ee.batch.Export.table.toBigQuery(
    collection=annotated_states, table='myproject.mydataset.mytable'
)
task.start()
# [END earthengine__bq-export__json]

# [START earthengine__bq-export__reduceRegions]
lucas = ee.FeatureCollection('JRC/LUCAS_HARMO/COPERNICUS_POLYGONS/V1/2018')
s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')

# Fetch the unique date values from the dataset.
dates = (
    lucas.aggregate_array('survey_date')
    .distinct()
    .map(lambda date: ee.Date.parse('dd/MM/yy', date))
)


# For each date, annotate the LUCAS samples with the Sentinel-2 band values for
# a two-week window.
def get_lucas_samples_for_date(date):
  date = ee.Date(date)
  image_for_date = s2.filterDate(
      date.advance(-1, 'week'), date.advance(1, 'week')
  ).select('B.*')
  median = image_for_date.median()
  lucas_for_date = lucas.filter(
      ee.Filter.equals('survey_date', date.format('dd/MM/yy'))
  )
  sample = median.reduceRegions(
      collection=lucas_for_date,
      reducer=ee.Reducer.mean(),
      scale=10,
      tileScale=8,
  )
  return sample


# Flatten the collection.
with_samples = ee.FeatureCollection(
    dates.map(get_lucas_samples_for_date)
).flatten()

task = ee.batch.Export.table.toBigQuery(
    collection=with_samples,
    table='myproject.mydataset.mytable',
    description='lucas_s2_annotated',
)
task.start()
# [END earthengine__bq-export__reduceRegions]


# [START earthengine__bq-export__transformGeo]
def transform_geo(e):
  my_error_margin = 10 * 1000  # meters
  return e.setGeometry(e.geometry(my_error_margin, 'EPSG:4326', True))


transformed_collection = original_collection.map(transform_geo)

# [END earthengine__bq-export__transformGeo]
