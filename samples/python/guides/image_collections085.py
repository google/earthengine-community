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
#   from 'Image collections - Compositing and mosaicking' page.


# [START earthengine__image_collections085__quality_mosaic]
# Define a function that scales and masks Landsat 8 surface reflectance images.
def prep_sr_l8(image):
  # Develop masks for unwanted pixels (fill, cloud, cloud shadow).
  qa_mask = image.select('QA_PIXEL').bitwiseAnd(int('11111', 2)).eq(0)
  saturation_mask = image.select('QA_RADSAT').eq(0)

  # Helper function to create image from scaling factors.
  def get_factor_img(factor_names):
    factor_list = image.toDictionary().select(factor_names).values()
    return ee.Image.constant(factor_list)

  # Apply the scaling factors to the appropriate bands.
  scale_img = get_factor_img(
      ['REFLECTANCE_MULT_BAND_.|TEMPERATURE_MULT_BAND_ST_B10']
  )
  offset_img = get_factor_img(
      ['REFLECTANCE_ADD_BAND_.|TEMPERATURE_ADD_BAND_ST_B10']
  )
  scaled = image.select('SR_B.|ST_B10').multiply(scale_img).add(offset_img)

  # Replace original bands with scaled bands and apply masks.
  return (
      image.addBands(scaled, None, True)
      .updateMask(qa_mask)
      .updateMask(saturation_mask)
  )


# This function masks clouds and adds quality bands to Landsat 8 images.
def add_quality_bands(image):
  # Normalized difference vegetation index.
  ndvi = image.normalizedDifference(['SR_B5', 'SR_B4'])
  # Image timestamp as milliseconds since Unix epoch.
  millis = (
      ee.Image(image.getNumber('system:time_start')).rename('millis').toFloat()
  )
  return prep_sr_l8(image).addBands([ndvi, millis])


# Load a 2014 Landsat 8 ImageCollection.
# Map the cloud masking and quality band function over the collection.
collection = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterDate('2014-06-01', '2014-12-31')
    .map(add_quality_bands)
)

# Create a cloud-free, most recent value composite.
recent_value_composite = collection.qualityMosaic('millis')

# Create a greenest pixel composite.
greenest_pixel_composite = collection.qualityMosaic('nd')

# Display the results.
m = geemap.Map()
m.set_center(-122.374, 37.8239, 12)  # San Francisco Bay
viz_params = {'bands': ['SR_B5', 'SR_B4', 'SR_B3'], 'min': 0, 'max': 0.4}
m.add_layer(recent_value_composite, viz_params, 'Recent value composite')
m.add_layer(greenest_pixel_composite, viz_params, 'Greenest pixel composite')

# Compare to a cloudy image in the collection.
cloudy = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140825')
m.add_layer(
    cloudy, {'bands': ['B5', 'B4', 'B3'], 'min': 0, 'max': 0.4}, 'Cloudy'
)
m
# [END earthengine__image_collections085__quality_mosaic]
