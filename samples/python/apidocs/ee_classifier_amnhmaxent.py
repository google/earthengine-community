# Copyright 2021 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_classifier_amnhmaxent]
"""Demonstrates the ee.Classifier.amnhMaxent method."""

import ee


# Authenticates to the Earth Engine servers.
ee.Authenticate()
# Initializes the client library.
ee.Initialize()


# Create some sample species presence/absence training data.
training_data = ee.FeatureCollection([
    # Species present points.
    ee.Feature(ee.Geometry.Point([-122.39567, 38.02740]), {'presence': 1}),
    ee.Feature(ee.Geometry.Point([-122.68560, 37.83690]), {'presence': 1}),
    # Species absent points.
    ee.Feature(ee.Geometry.Point([-122.59755, 37.92402]), {'presence': 0}),
    ee.Feature(ee.Geometry.Point([-122.47137, 37.99291]), {'presence': 0}),
    ee.Feature(ee.Geometry.Point([-122.52905, 37.85642]), {'presence': 0}),
    ee.Feature(ee.Geometry.Point([-122.03010, 37.66660]), {'presence': 0})
])

# Import a Landsat 8 image and select the reflectance bands.
image = (ee.Image('LANDSAT/LC08/C01/T1_SR/LC08_044034_20200606')
         .select(['B[0-9]*']))

# Sample the image at the location of the points.
training = image.sampleRegions(**{
    'collection': training_data,
    'scale': 30
})

# Define and train a Maxent classifier from the image-sampled points.
classifier = ee.Classifier.amnhMaxent().train(**{
    'features': training,
    'classProperty': 'presence',
    'inputProperties': image.bandNames()
})

# Classify the image using the Maxent classifier.
image_classified = image.classify(classifier)
# [END earthengine__apidocs__ee_classifier_amnhmaxent]
