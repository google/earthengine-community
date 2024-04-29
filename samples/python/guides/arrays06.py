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
#   from 'Arrays - Sorting and Reducing' section


# [START earthengine__arrays06__sort_reduce]
# Define a function that scales and masks Landsat 8 surface reflectance images
# and adds an NDVI band.
def prep_sr_l8(image):
  # Develop masks for unwanted pixels (fill, cloud, cloud shadow).
  qa_mask = image.select('QA_PIXEL').bitwiseAnd(int('11111', 2)).eq(0)
  saturation_mask = image.select('QA_RADSAT').eq(0)

  # Apply the scaling factors to the appropriate bands.
  optical_bands = image.select('SR_B.').multiply(0.0000275).add(-0.2)
  thermal_bands = image.select('ST_B.*').multiply(0.00341802).add(149.0)

  # Calculate NDVI.
  ndvi = optical_bands.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')

  # Replace the original bands with the scaled ones and apply the masks.
  return (
      image.addBands(optical_bands, None, True)
      .addBands(thermal_bands, None, True)
      .addBands(ndvi)
      .updateMask(qa_mask)
      .updateMask(saturation_mask)
  )


# Define an arbitrary region of interest as a point.
roi = ee.Geometry.Point(-122.26032, 37.87187)

# Load a Landsat 8 surface reflectance collection.
collection = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    # Filter to get only imagery at a point of interest.
    .filterBounds(roi)
    # Filter to get only six months of data.
    .filterDate('2021-01-01', '2021-07-01')
    # Prepare images by mapping the prep_sr_l8 function over the collection.
    .map(prep_sr_l8)
    # Select the bands of interest to avoid taking up unneeded memory.
    .select('SR_B.|NDVI')
)

# Convert the collection to an array.
array = collection.toArray()

# Label of the axes.
image_axis = 0
band_axis = 1

# Get the NDVI slice and the bands of interest.
band_names = collection.first().bandNames()
bands = array.arraySlice(band_axis, 0, band_names.length())
ndvi = array.arraySlice(band_axis, -1)

# Sort by descending NDVI.
sorted = bands.arraySort(ndvi.multiply(-1))

# Get the highest 20% NDVI observations per pixel.
num_images = sorted.arrayLength(image_axis).multiply(0.2).int()
highest_ndvi = sorted.arraySlice(image_axis, 0, num_images)

# Get the mean of the highest 20% NDVI observations by reducing
# along the image axis.
mean = highest_ndvi.arrayReduce(reducer=ee.Reducer.mean(), axes=[image_axis])

# Turn the reduced array image into a multi-band image for display.
mean_image = mean.arrayProject([band_axis]).arrayFlatten([band_names])
m = geemap.Map()
m.center_object(roi, 12)
m.add_layer(
    mean_image, {'bands': ['SR_B6', 'SR_B5', 'SR_B4'], 'min': 0, 'max': 0.4}
)
m
# [END earthengine__arrays06__sort_reduce]
