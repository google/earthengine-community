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

"""Earth Engine Developer's Guide examples from 'Iterating' page."""

# [START earthengine__image_collections09__iterate]
import altair as alt
# Load MODIS EVI imagery.
collection = ee.ImageCollection('MODIS/006/MYD13A1').select('EVI')

# Define reference conditions from the first 10 years of data.
reference = collection.filterDate('2001-01-01', '2010-12-31').sort(
    # Sort chronologically in descending order.
    'system:time_start',
    False,
)

# Compute the mean of the first 10 years.
mean = reference.mean()

# Compute anomalies by subtracting the 2001-2010 mean from each image in a
# collection of 2011-2014 images. Copy the date metadata over to the
# computed anomaly images in the new collection.
series = collection.filterDate('2011-01-01', '2014-12-31').map(
    lambda image: image.subtract(mean).set(
        'system:time_start', image.get('system:time_start')
    )
)

# Display cumulative anomalies.
m = geemap.Map()
m.set_center(-100.811, 40.2, 5)
m.add_layer(
    series.sum(),
    {'min': -60000, 'max': 60000, 'palette': ['FF0000', '000000', '00FF00']},
    'EVI anomaly',
)
display(m)

# Get the timestamp from the most recent image in the reference collection.
time_0 = reference.first().get('system:time_start')

# Use imageCollection.iterate() to make a collection of cumulative anomaly over time.
# The initial value for iterate() is a list of anomaly images already processed.
# The first anomaly image in the list is just 0, with the time_0 timestamp.
first = ee.List([
    # Rename the first band 'EVI'.
    ee.Image(0)
    .set('system:time_start', time_0)
    .select([0], ['EVI'])
])

# This is a function to pass to Iterate().
# As anomaly images are computed, add them to the list.
def accumulate(image, list):
  # Get the latest cumulative anomaly image from the end of the list with
  # get(-1).  Since the type of the list argument to the function is unknown,
  # it needs to be cast to a List.  Since the return type of get() is unknown,
  # cast it to Image.
  previous = ee.Image(ee.List(list).get(-1))
  # Add the current anomaly to make a new cumulative anomaly image.
  added = image.add(previous).set(
      # Propagate metadata to the new image.
      'system:time_start',
      image.get('system:time_start'),
  )
  # Return the list with the cumulative anomaly inserted.
  return ee.List(list).add(added)

# Create an ImageCollection of cumulative anomaly images by iterating.
# Since the return type of iterate is unknown, it needs to be cast to a List.
cumulative = ee.ImageCollection(ee.List(series.iterate(accumulate, first)))

# Predefine the chart titles.
title = 'Cumulative EVI anomaly over time'

# Chart some interesting locations.
def display_chart(region, collection):
  reduced = (
      collection.filterBounds(region)
      .sort('system:time_start')
      .map(
          lambda image: ee.Feature(
              None,
              image.reduceRegion(ee.Reducer.first(), region, 500).set(
                  'time', image.get('system:time_start')
              ),
          )
      )
  )
  reduced_dataframe = ee.data.computeFeatures(
      {'expression': reduced, 'fileFormat': 'PANDAS_DATAFRAME'}
  )
  alt.Chart(reduced_dataframe).mark_line().encode(
      alt.X('time:T').title('Time'),
      alt.Y('EVI:Q').title('Cumulative EVI anomaly'),
  ).properties(title=title).display()

pt_1 = ee.Geometry.Point(-65.544, -4.894)
display('Amazon rainforest:')
display_chart(pt_1, cumulative)

pt_2 = ee.Geometry.Point(116.4647, 40.1054)
display('Beijing urbanization:')
display_chart(pt_2, cumulative)

pt_3 = ee.Geometry.Point(-110.3412, 34.1982)
display('Arizona forest disturbance and recovery:')
display_chart(pt_3, cumulative)
# [END earthengine__image_collections09__iterate]
