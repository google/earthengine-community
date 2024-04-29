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

# Arrays
# Earth Engine Developer's Guide examples
# Array transformation section

# [START earthengine__arrays04__harmonic_model]
import math


# Scales and masks Landsat 8 surface reflectance images.
def prep_sr_l8(image):
  # Develop masks for unwanted pixels (fill, cloud, cloud shadow).
  qa_mask = image.select('QA_PIXEL').bitwiseAnd(int('11111', 2)).eq(0)
  saturation_mask = image.select('QA_RADSAT').eq(0)

  # Apply the scaling factors to the appropriate bands.
  optical_bands = image.select('SR_B.').multiply(0.0000275).add(-0.2)
  thermal_bands = image.select('ST_B.*').multiply(0.00341802).add(149.0)

  # Replace the original bands with the scaled ones and apply the masks.
  return (
      image.addBands(optical_bands, None, True)
      .addBands(thermal_bands, None, True)
      .updateMask(qa_mask)
      .updateMask(saturation_mask)
  )


# Load a Landsat 8 surface reflectance image collection.
collection = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    # Filter to get only two years of data.
    .filterDate('2019-04-01', '2021-04-01')
    # Filter to get only imagery at a point of interest.
    .filterBounds(ee.Geometry.Point(-122.08709, 36.9732))
    # Prepare images by mapping the prep_sr_l8 function over the collection.
    .map(prep_sr_l8)
    # Select NIR and red bands only.
    .select(['SR_B5', 'SR_B4'])
    # Sort the collection in chronological order.
    .sort('system:time_start', True)
)


# This function computes the predictors and the response from the input.
def make_variables(image):
  # Compute time of the image in fractional years relative to the Epoch.
  year = ee.Image(image.date().difference(ee.Date('1970-01-01'), 'year'))
  # Compute the season in radians, one cycle per year.
  season = year.multiply(2 * math.pi)
  # Return an image of the predictors followed by the response.
  return (
      image.select()
      .addBands(ee.Image(1))  # 0. constant
      .addBands(year.rename('t'))  # 1. linear trend
      .addBands(season.sin().rename('sin'))  # 2. seasonal
      .addBands(season.cos().rename('cos'))  # 3. seasonal
      .addBands(image.normalizedDifference().rename('NDVI'))  # 4. response
      .toFloat()
  )


# Define the axes of variation in the collection array.
image_axis = 0
band_axis = 1

# Convert the collection to an array.
array = collection.map(make_variables).toArray()

# Check the length of the image axis (number of images).
array_length = array.arrayLength(image_axis)
# Update the mask to ensure that the number of images is greater than or
# equal to the number of predictors (the linear model is solvable).
array = array.updateMask(array_length.gt(4))

# Get slices of the array according to positions along the band axis.
predictors = array.arraySlice(band_axis, 0, 4)
response = array.arraySlice(band_axis, 4)
# [END earthengine__arrays04__harmonic_model]

# Solve for linear regression coefficients in three different ways.
# All three methods produce equivalent results, but some are easier.
# [START earthengine__arrays04__hard_way]
# Compute coefficients the hard way.
coefficients_1 = (
    predictors.arrayTranspose()
    .matrixMultiply(predictors)
    .matrixInverse()
    .matrixMultiply(predictors.arrayTranspose())
    .matrixMultiply(response)
)
# [END earthengine__arrays04__hard_way]

# [START earthengine__arrays04__easy_way]
# Compute coefficients the easy way.
coefficients_2 = predictors.matrixPseudoInverse().matrixMultiply(response)
# [END earthengine__arrays04__easy_way]

# [START earthengine__arrays04__easiest_way]
# Compute coefficients the easiest way.
coefficients_3 = predictors.matrixSolve(response)
# [END earthengine__arrays04__easiest_way]

# [START earthengine__arrays04__image_flatten]
# Turn the results into a multi-band image.
coefficients_image = (
    coefficients_3
    # Get rid of the extra dimensions.
    .arrayProject([0]).arrayFlatten([['constant', 'trend', 'sin', 'cos']])
)
# [END earthengine__arrays04__image_flatten]

import pandas as pd
import matplotlib.pyplot as plt

# Use this mask for cartographic purposes, to get rid of water areas.
mask = ee.Image('CGIAR/SRTM90_V4').mask()

# Display the result.
m = geemap.Map()
m.set_center(-122.08709, 36.9732, 13)
m.add_layer(
    coefficients_image.updateMask(mask),
    {
        'bands': ['sin', 'trend', 'cos'],
        'min': [-0.05, -0.1, -0.05],
        'max': [0.05, 0.1, 0.05],
    },
)
display(m)


# Map a function over the collection to compute the fitted values at each time.
def add_fitted_trend(image):
  coeffs = coefficients_image.select(['constant', 'trend', 'sin', 'cos'])
  predicted = (
      image.select(['constant', 't', 'sin', 'cos'])
      .multiply(coeffs)
      .reduce('sum')
      .rename('fitted')
  )

  return image.select('NDVI').addBands(predicted)


fitted = collection.map(make_variables).map(add_fitted_trend)

# Define a point that expresses a seasonal NDVI pattern.
roi = ee.Geometry.Point(-122.08709, 36.9732).buffer(120)


def extract_chart_data(image):
  date = image.date().format('YYYY-MM-dd')
  values = image.reduceRegion(reducer=ee.Reducer.mean(), geometry=roi, scale=30)

  return ee.Feature(roi, values).set('date', date)


fitted = fitted.map(extract_chart_data)

df = ee.data.computeFeatures(
    {'expression': fitted, 'fileFormat': 'PANDAS_DATAFRAME'}
)

plt.figure(figsize=(10, 6))
plt.plot(df['date'], df['NDVI'], label='NDVI')
plt.plot(df['date'], df['fitted'], label='Fitted')
plt.xticks(rotation=90)
plt.xlabel('Date')
plt.ylabel('Value')
plt.legend()
plt.title('NDVI and Fitted Trend')
plt.grid(True)
plt.show()
