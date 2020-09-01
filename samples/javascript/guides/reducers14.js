/**
 * Copyright 2020 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Earth Engine Developer's Guide examples
 *   from 'Reducers - linear regression' section
 */

// [START earthengine__reducers14__linear_regression]
// This function adds a time band to the image.
var createTimeBand = function(image) {
  // Scale milliseconds by a large constant.
  return image.addBands(image.metadata('system:time_start').divide(1e18));
};

// This function adds a constant band to the image.
var createConstantBand = function(image) {
  return ee.Image(1).addBands(image);
};

// Load the input image collection: projected climate data.
var collection = ee.ImageCollection('NASA/NEX-DCP30_ENSEMBLE_STATS')
  .filterDate(ee.Date('2006-01-01'), ee.Date('2099-01-01'))
  .filter(ee.Filter.eq('scenario', 'rcp85'))
  // Map the functions over the collection, to get constant and time bands.
  .map(createTimeBand)
  .map(createConstantBand)
  // Select the predictors and the responses.
  .select(['constant', 'system:time_start', 'pr_mean', 'tasmax_mean']);

// Compute ordinary least squares regression coefficients.
var linearRegression = collection.reduce(
  ee.Reducer.linearRegression({
    numX: 2,
    numY: 2
}));

// Compute robust linear regression coefficients.
var robustLinearRegression = collection.reduce(
  ee.Reducer.robustLinearRegression({
    numX: 2,
    numY: 2
}));

// The results are array images that must be flattened for display.
// These lists label the information along each axis of the arrays.
var bandNames = [['constant', 'time'], // 0-axis variation.
                 ['precip', 'temp']]; // 1-axis variation.

// Flatten the array images to get multi-band images according to the labels.
var lrImage = linearRegression.select(['coefficients']).arrayFlatten(bandNames);
var rlrImage = robustLinearRegression.select(['coefficients']).arrayFlatten(bandNames);

// Display the OLS results.
Map.setCenter(-100.11, 40.38, 5);
Map.addLayer(lrImage,
  {min: 0, max: [-0.9, 8e-5, 1], bands: ['time_precip', 'constant_precip', 'time_precip']}, 'OLS');

// Compare the results at a specific point:
print('OLS estimates:', lrImage.reduceRegion({
  reducer: ee.Reducer.first(),
  geometry: ee.Geometry.Point([-96.0, 41.0]),
  scale: 1000
}));

print('Robust estimates:', rlrImage.reduceRegion({
  reducer: ee.Reducer.first(),
  geometry: ee.Geometry.Point([-96.0, 41.0]),
  scale: 1000
}));
// [END earthengine__reducers14__linear_regression]
