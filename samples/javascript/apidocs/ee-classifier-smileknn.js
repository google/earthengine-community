/**
 * Copyright 2023 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START earthengine__apidocs__ee_classifier_smileknn]
// Cloud masking for Landsat 8.
function maskL8sr(image) {
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);

  // Apply the scaling factors to the appropriate bands.
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);

  // Replace the original bands with the scaled ones and apply the masks.
  return image.addBands(opticalBands, null, true)
      .addBands(thermalBands, null, true)
      .updateMask(qaMask)
      .updateMask(saturationMask);
}

// Map the function over one year of data.
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
                     .filterDate('2020-01-01', '2021-01-01')
                     .map(maskL8sr);

// Make a median composite.
var composite = collection.median();

// Demonstration labels.
var labels = ee.FeatureCollection('projects/google/demo_landcover_labels')

// Use these bands for classification.
var bands = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'];
// The name of the property on the points storing the class label.
var classProperty = 'landcover';

// Sample the composite to generate training data.  Note that the
// class label is stored in the 'landcover' property.
var training = composite.select(bands).sampleRegions(
    {collection: labels, properties: [classProperty], scale: 30});

// Train a kNN classifier.
var classifier = ee.Classifier.smileKNN(5).train({
  features: training,
  classProperty: classProperty,
});

// Classify the composite.
var classified = composite.classify(classifier);
Map.setCenter(-122.184, 37.796, 12);
Map.addLayer(classified, {min: 0, max: 2, palette: ['red', 'green', 'blue']});
// [END earthengine__apidocs__ee_classifier_smileknn]
