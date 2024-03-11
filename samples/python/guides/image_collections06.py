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

"""Earth Engine Developer's Guide examples from 'Reducing' page."""


# [START earthengine__image_collections06__linear_fit]
# This function adds a band representing the image timestamp.
def add_time(image):
  return image.addBands(
      image.metadata('system:time_start')
      # Convert milliseconds from epoch to years to aid in
      # interpretation of the following trend calculation.
      .divide(1000 * 60 * 60 * 24 * 365)
  )


# Load a MODIS collection, filter to several years of 16 day mosaics,
# and map the time band function over it.
collection = (
    ee.ImageCollection('MODIS/006/MYD13A1')
    .filterDate('2004-01-01', '2010-10-31')
    .map(add_time)
)

# Select the bands to model with the independent variable first.
trend = collection.select(['system:time_start', 'EVI']).reduce(
    # Compute the linear trend over time.
    ee.Reducer.linearFit()
)

# Display the trend with increasing slopes in green, decreasing in red.
m.set_center(-96.943, 39.436, 5)
m = geemap.Map()
m.add_layer(
    trend,
    {
        'min': 0,
        'max': [-100, 100, 10000],
        'bands': ['scale', 'scale', 'offset'],
    },
    'EVI trend',
)
m
# [END earthengine__image_collections06__linear_fit]
