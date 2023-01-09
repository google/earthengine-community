# Copyright 2023 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START earthengine__apidocs__ee_featurecollection_classify]
from pprint import pprint

# Classifies features in a FeatureCollection and computes an error matrix.

# Combine Landsat and NLCD images using only the bands representing
# predictor variables (spectral reflectance) and target labels (land cover).
spectral = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_038032_20160820').select(
    'SR_B[1-7]')
landcover = ee.Image('USGS/NLCD_RELEASES/2016_REL/2016').select('landcover')
sample_source = spectral.addBands(landcover)

# Sample the combined images to generate a FeatureCollection.
sample = sample_source.sample(**{
    # sample only from within Landsat image extent
    'region': spectral.geometry(),
    'scale': 30,
    'numPixels': 2000,
    'geometries': True
})
# Add a random value column with uniform distribution for hold-out
# training/validation splitting.
sample = sample.randomColumn(**{'distribution': 'uniform'})
print('Sample for classifier development:', sample.getInfo())

# Split out ~80% of the sample for training the classifier.
training = sample.filter('random < 0.8')
print('Training set:', training.getInfo())

# Train a random forest classifier.
classifier = ee.Classifier.smileRandomForest(10).train(**{
    'features': training,
    'classProperty': landcover.bandNames().get(0),
    'inputProperties': spectral.bandNames()
})

# Classify the sample.
predictions = sample.classify(
    **{'classifier': classifier, 'outputName': 'predicted_landcover'})
print('Predictions:', predictions.getInfo())

# Split out the validation feature set.
validation = predictions.filter('random >= 0.8')
print('Validation set:', validation.getInfo())

# Get a list of possible class values to use for error matrix axis labels.
order = sample.aggregate_array('landcover').distinct().sort()
print('Error matrix axis labels:', order.getInfo())

# Compute an error matrix that compares predicted vs. expected values.
error_matrix = validation.errorMatrix(**{
    'actual': landcover.bandNames().get(0),
    'predicted': 'predicted_landcover',
    'order': order
})
print('Error matrix:')
pprint(error_matrix.getInfo())

# Compute accuracy metrics from the error matrix.
print('Overall accuracy:', error_matrix.accuracy().getInfo())
print('Consumer\'s accuracy:')
pprint(error_matrix.consumersAccuracy().getInfo())
print('Producer\'s accuracy:')
pprint(error_matrix.producersAccuracy().getInfo())
print('Kappa:', error_matrix.kappa().getInfo())
# [END earthengine__apidocs__ee_featurecollection_classify]
