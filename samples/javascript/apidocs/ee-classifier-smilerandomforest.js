/**
 * Copyright 2021 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_classifier_smilerandomforest]
// A Sentinel-2 surface reflectance image, reflectance bands selected,
// serves as the source for training and prediction in this contrived example.
var img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG')
              .select('B.*');

// ESA WorldCover land cover map, used as label source in classifier training.
var lc = ee.Image('ESA/WorldCover/v100/2020');

// Remap the land cover class values to a 0-based sequential series.
var classValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100];
var remapValues = ee.List.sequence(0, 10);
var label = 'lc';
lc = lc.remap(classValues, remapValues).rename([label]);

// Add land cover as a band of the reflectance image and sample 500 pixels at
// 10 m scale from within a region of interest.
var roi = ee.Geometry.Rectangle(-122.347, 37.743, -122.024, 37.838);
var trainingSample = img.addBands(lc).sample({
  region: roi,
  scale: 10,
  numPixels: 500,
  geometries: true
});

// Train a 10-tree random forest classifier from the sample.
var trainedClassifier = ee.Classifier.smileRandomForest(10)
                            .train(trainingSample, label);

// Classify the reflectance image.
var classified = img.classify(trainedClassifier);

// Add the layers to the map.
var classVis = {
  min: 0,
  max: 10,
  palette: ['006400' ,'ffbb22', 'ffff4c', 'f096ff', 'fa0000', 'b4b4b4',
            'f0f0f0', '0064c8', '0096a0', '00cf75', 'fae6a0']
};
Map.setCenter(-122.184, 37.796, 12);
Map.addLayer(img, {bands: ['B11', 'B8', 'B3'], min: 100, max: 3500}, 'img');
Map.addLayer(lc, classVis, 'lc');
Map.addLayer(classified, classVis, 'classified');
Map.addLayer(roi, {color: 'white'}, 'roi', false, 0.5);
Map.addLayer(trainingSample, {color: 'black'}, 'trainingSample', false, 0.7);
// [END earthengine__apidocs__ee_classifier_smilerandomforest]
