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

# [START earthengine__classification03__sample]
# Define a region of interest.
roi = ee.Geometry.BBox(-122.93, 36.99, -121.20, 38.16)


# Define a function that scales and masks Landsat 8 surface reflectance images.
def prep_sr_l8(image):
  """Scales and masks Landsat 8 surface reflectance images."""
  # Develop masks for unwanted pixels (fill, cloud, cloud shadow).
  qa_mask = image.select('QA_PIXEL').bitwiseAnd(0b1111).eq(0)
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
inputImage = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterBounds(roi)
    .filterDate('2020-03-01', '2020-07-01')
    .map(prep_sr_l8)
    .median()
    .setDefaultProjection('EPSG:4326', None, 30)
    .select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7']))

# Use MODIS land cover, IGBP classification, for training.
modis = ee.Image('MODIS/006/MCD12Q1/2020_01_01').select('LC_Type1')

# Sample the input imagery to get a FeatureCollection of training data.
training = inputImage.addBands(modis).sample({
    'region': roi,
    'numPixels': 5000,
    'seed': 0
})

# Make a Random Forest classifier and train it.
classifier = ee.Classifier.smileRandomForest(10).train({
    'features': training,
    'classProperty': 'LC_Type1',
    'inputProperties': [
        'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7']})

# Classify the input imagery.
classified = inputImage.classify(classifier)

# Get a confusion matrix representing resubstitution accuracy.
train_accuracy = classifier.confusionMatrix()
print('Resubstitution error matrix: ', train_accuracy)
print('Training overall accuracy: ', train_accuracy.accuracy())

# Sample the input with a different random seed to get validation data.
validation = inputImage.addBands(modis).sample({
    'region': roi,
    'numPixels': 5000,
    'seed': 1
            # Filter the result to get rid of any null pixels.
    }).filter(ee.Filter.notNull(inputImage.bandNames()))

# Classify the validation data.
validated = validation.classify(classifier)

# Get a confusion matrix representing expected accuracy.
testAccuracy = validated.errorMatrix('LC_Type1', 'classification')
print('Validation error matrix: ', testAccuracy)
print('Validation overall accuracy: ', testAccuracy.accuracy())

# Define a palette for the IGBP classification.
igbp_palette = [
    'aec3d4',  # water
    '152106', '225129', '369b47', '30eb5b', '387242',  # forest
    '6a2325', 'c3aa69', 'b76031', 'd9903d', '91af40',  # shrub, grass
    '111149',  # wetlands
    'cdb33b',  # croplands
    'cc0013',  # urban
    '33280d',  # crop mosaic
    'd7cdcc',  # snow and ice
    'f7e084',  # barren
    '6f6f6f'   # tundra
]

# Display the input and the classification with geemap in a notebook.
Map = geemap.Map
Map.centerObject(roi, 10)
Map.addLayer(inputImage.clip(roi),
             {'bands': ['SR_B4', 'SR_B3', 'SR_B2'], 'min': 0, 'max': 0.25},
             'landsat')
Map.addLayer(classified.clip(roi),
             {'palette': igbp_palette, 'min': 0, 'max': 17},
             'classification')
# [END earthengine__classification03__sample]
# [START earthengine__classification03__one_sample]
sample = inputImage.addBands(modis).sample({
    'numPixels': 5000,
    'seed': 0
})

# The randomColumn() method will add a column of uniform random
# numbers in a column named 'random' by default.
sample = sample.randomColumn()

split = 0.7  # Roughly 70% training, 30% testing.
training = sample.filter(ee.Filter.lt('random', split))
validation = sample.filter(ee.Filter.gte('random', split))
# [END earthengine__classification03__one_sample]

# [START earthengine__classification03__spatial_autocorrelation]
# Sample the input imagery to get a FeatureCollection of training data.
sample = inputImage.addBands(modis).sample({
    'region': roi,
    'numPixels': 5000,
    'seed': 0,
    'geometries': True,
    'tileScale': 16
})

# The randomColumn() method will add a column of uniform random
# numbers in a column named 'random' by default.
sample = sample.randomColumn()

split = 0.7  # Roughly 70% training, 30% testing.
training = sample.filter(ee.Filter.lt('random', split))
print(training.size())
validation = sample.filter(ee.Filter.gte('random', split))

# Spatial join.
dist_filter = ee.Filter.withinDistance({
    'distance': 1000,
    'leftField': '.geo',
    'rightField': '.geo',
    'maxError': 10
})

join = ee.Join.inverted()

# Apply the join.
training = join.apply(training, validation, dist_filter)
print(training.size())
# [END earthengine__classification03__spatial_autocorrelation]
# [START earthengine__classification03__export_classifier]
# Using the random forest classifier defined earlier, export the random
# forest classifier as an Earth Engine asset.
classifier_asset_id = '<asset_prefix>/upscaled_MCD12Q1_random_forest'
task = ee.batch.Export.classifier.toAsset(
    classifier, 'Saved-random-forest-IGBP-classification', classifier_asset_id
)
task.start()
# [END earthengine__classification03__export_classifier]
# [START earthengine__classification03__load_classifier]
# Once the classifier export finishes, we can load our saved classifier.
saved_classifier = ee.Classifier.load(classifier_asset_id)
# We can perform classification just as before with the saved classifier now.
Map.addLayer(inputImage.classify(saved_classifier).clip(roi),
             {'palette': igbp_palette, 'min': 0, 'max': 17},
             'classification')
# [END earthengine__classification03__load_classifier]
