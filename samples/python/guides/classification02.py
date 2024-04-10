# Copyright 2023 The Google Earth Engine Community Authors
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

"""Google Earth Engine Developer's Guide examples from 'Classification - Supervised Classification' page."""
import ee
import geemap


# [START earthengine__classification02__polygon_training]
# Define a function that scales and masks Landsat 8 surface reflectance images.
def prep_sr_l8(image):
  # Develop masks for unwanted pixels (fill, cloud, cloud shadow).
  qa_mask = image.select('QA_PIXEL').bitwiseAnd(0b11111).eq(0)
  saturation_mask = image.select('QA_RADSAT').eq(0)

  # Apply the scaling factors to the appropriate bands.
  def _get_factor_img(factor_names):
    factor_list = image.toDictionary().select(factor_names).values()
    return ee.Image.constant(factor_list)
  scale_img = _get_factor_img([
      'REFLECTANCE_MULT_BAND_.|TEMPERATURE_MULT_BAND_ST_B10'])
  offset_img = _get_factor_img([
      'REFLECTANCE_ADD_BAND_.|TEMPERATURE_ADD_BAND_ST_B10'])
  scaled = image.select('SR_B.|ST_B10').multiply(scale_img).add(offset_img)

  # Replace original bands with scaled bands and apply masks.
  return image.addBands(scaled, None, True).updateMask(
      qa_mask).updateMask(saturation_mask)


# Make a cloud-free Landsat 8 surface reflectance composite.
l8_image = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterDate('2018-01-01', '2019-01-01')
    .map(prep_sr_l8)
    .median())

# Use these bands for prediction.
bands = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7']

# Manually created polygons.
forest1 = ee.Geometry.Rectangle(-63.0187, -9.3958, -62.9793, -9.3443)
forest2 = ee.Geometry.Rectangle(-62.8145, -9.206, -62.7688, -9.1735)
non_forest1 = ee.Geometry.Rectangle(-62.8161, -9.5001, -62.7921, -9.4486)
non_forest2 = ee.Geometry.Rectangle(-62.6788, -9.044, -62.6459, -8.9986)

# Make a FeatureCollection from the hand-made geometries.
polygons = ee.FeatureCollection([
    ee.Feature(non_forest1, {'class': 0}),
    ee.Feature(non_forest1, {'class': 0}),
    ee.Feature(forest1, {'class': 1}),
    ee.Feature(forest2, {'class': 1}),
])

# Get the values for all pixels in each polygon in the training.
training = l8_image.sampleRegions(
    # Get the sample from the polygons FeatureCollection.
    collection=polygons,
    # Keep this list of properties from the polygons.
    properties=['class'],
    # Set the scale to get Landsat pixels in the polygons.
    scale=30,
)

# Create an SVM classifier with custom parameters.
classifier = ee.Classifier.libsvm(kernelType='RBF', gamma=0.5, cost=10)

# Train the classifier.
trained = classifier.train(training, 'class', bands)

# Classify the image.
classified = l8_image.classify(trained)

# Display the classification result and the input image.
m = geemap.Map()
m.set_center(-62.836, -9.2399, 9)
m.add_layer(
    l8_image,
    {'bands': ['SR_B4', 'SR_B3', 'SR_B2'], 'min': 0, 'max': 0.25},
    'image',
)
m.add_layer(polygons, {'color': 'yellow'}, 'training polygons')
m.add_layer(
    classified,
    {'min': 0, 'max': 1, 'palette': ['orange', 'green']},
    'deforestation',
)
m
# [END earthengine__classification02__polygon_training]
