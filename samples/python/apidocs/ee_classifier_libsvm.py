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

# [START earthengine__apidocs__ee_classifier_libsvm]
# A Sentinel-2 surface reflectance image, reflectance bands selected,
# serves as the source for training and prediction in this contrived example.
img = ee.Image(
    'COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG'
).select('B.*')

# ESA WorldCover land cover map, used as label source in classifier training.
lc = ee.Image('ESA/WorldCover/v100/2020')

# Remap the land cover class values to a 0-based sequential series.
class_values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100]
remap_values = ee.List.sequence(0, 10)
label = 'lc'
lc = lc.remap(class_values, remap_values).rename(label).toByte()

# Add land cover as a band of the reflectance image and sample 100 pixels at
# 10 m scale from each land cover class within a region of interest.
roi = ee.Geometry.Rectangle(-122.347, 37.743, -122.024, 37.838)
sample = img.addBands(lc).stratifiedSample(
    numPoints=100, classBand=label, region=roi, scale=10, geometries=True
)

# Add a random value field to the sample and use it to approximately split 80%
# of the features into a training set and 20% into a validation set.
sample = sample.randomColumn()
training_sample = sample.filter('random <= 0.8')
validation_sample = sample.filter('random > 0.8')

# Train an SVM classifier (C-SVM classification, voting decision procedure,
# linear kernel) from the training sample.
trained_classifier = ee.Classifier.libsvm().train(
    features=training_sample,
    classProperty=label,
    inputProperties=img.bandNames(),
)

# Get information about the trained classifier.
display('Results of trained classifier', trained_classifier.explain())

# Get a confusion matrix and overall accuracy for the training sample.
train_accuracy = trained_classifier.confusionMatrix()
display('Training error matrix', train_accuracy)
display('Training overall accuracy', train_accuracy.accuracy())

# Get a confusion matrix and overall accuracy for the validation sample.
validation_sample = validation_sample.classify(trained_classifier)
validation_accuracy = validation_sample.errorMatrix(label, 'classification')
display('Validation error matrix', validation_accuracy)
display('Validation accuracy', validation_accuracy.accuracy())

# Classify the reflectance image from the trained classifier.
img_classified = img.classify(trained_classifier)

# Add the layers to the map.
class_vis = {
    'min': 0,
    'max': 10,
    'palette': [
        '006400',
        'ffbb22',
        'ffff4c',
        'f096ff',
        'fa0000',
        'b4b4b4',
        'f0f0f0',
        '0064c8',
        '0096a0',
        '00cf75',
        'fae6a0',
    ],
}
m = geemap.Map()
m.set_center(-122.184, 37.796, 12)
m.add_ee_layer(
    img, {'bands': ['B11', 'B8', 'B3'], 'min': 100, 'max': 3500}, 'img'
)
m.add_ee_layer(lc, class_vis, 'lc')
m.add_ee_layer(img_classified, class_vis, 'Classified')
m.add_ee_layer(roi, {'color': 'white'}, 'ROI', False, 0.5)
m.add_ee_layer(training_sample, {'color': 'black'}, 'Training sample', False)
m.add_ee_layer(
    validation_sample, {'color': 'white'}, 'Validation sample', False
)
m
# [END earthengine__apidocs__ee_classifier_libsvm]
