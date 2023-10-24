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


# [START earthengine__apidocs__ee_classifier_smileknn]
# Cloud masking for Landsat 8.
def mask_l8_sr(image):
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


# Map the function over one year of data.
collection = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterDate('2020-01-01', '2021-01-01')
    .map(mask_l8_sr)
)

# Make a median composite.
composite = collection.median()

# Demonstration labels.
labels = ee.FeatureCollection('projects/google/demo_landcover_labels')

# Use these bands for classification.
bands = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7']
# The name of the property on the points storing the class label.
class_property = 'landcover'

# Sample the composite to generate training data.  Note that the
# class label is stored in the 'landcover' property.
training = composite.select(bands).sampleRegions(
    collection=labels, properties=[class_property], scale=30
)

# Train a kNN classifier.
classifier = ee.Classifier.smileKNN(5).train(
    features=training, classProperty=class_property
)

# Classify the composite.
classified = composite.classify(classifier)

m = geemap.Map()
m.set_center(-122.184, 37.796, 12)
m.add_layer(
    classified, {'min': 0, 'max': 2, 'palette': ['red', 'green', 'blue']}
)
m
# [END earthengine__apidocs__ee_classifier_smileknn]