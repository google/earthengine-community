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

// Arrays
// Earth Engine Developer's Guide examples
// Array transformation section

// [START earthengine__arrays04__harmonic_model]
// Scales and masks Landsat 8 surface reflectance images.
function prepSrL8(image) {
  // Develop masks for unwanted pixels (fill, cloud, cloud shadow).
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

// Load a Landsat 8 surface reflectance image collection.
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  // Filter to get only two years of data.
  .filterDate('2019-04-01', '2021-04-01')
  // Filter to get only imagery at a point of interest.
  .filterBounds(ee.Geometry.Point(-122.08709, 36.9732))
  // Prepare images by mapping the prepSrL8 function over the collection.
  .map(prepSrL8)
  // Select NIR and red bands only.
  .select(['SR_B5', 'SR_B4'])
  // Sort the collection in chronological order.
  .sort('system:time_start', true);

// This function computes the predictors and the response from the input.
var makeVariables = function(image) {
  // Compute time of the image in fractional years relative to the Epoch.
  var year = ee.Image(image.date().difference(ee.Date('1970-01-01'), 'year'));
  // Compute the season in radians, one cycle per year.
  var season = year.multiply(2 * Math.PI);
  // Return an image of the predictors followed by the response.
  return image.select()
    .addBands(ee.Image(1))                                  // 0. constant
    .addBands(year.rename('t'))                             // 1. linear trend
    .addBands(season.sin().rename('sin'))                   // 2. seasonal
    .addBands(season.cos().rename('cos'))                   // 3. seasonal
    .addBands(image.normalizedDifference().rename('NDVI'))  // 4. response
    .toFloat();
};

// Define the axes of variation in the collection array.
var imageAxis = 0;
var bandAxis = 1;

// Convert the collection to an array.
var array = collection.map(makeVariables).toArray();

// Check the length of the image axis (number of images).
var arrayLength = array.arrayLength(imageAxis);
// Update the mask to ensure that the number of images is greater than or
// equal to the number of predictors (the linear model is solvable).
array = array.updateMask(arrayLength.gt(4));

// Get slices of the array according to positions along the band axis.
var predictors = array.arraySlice(bandAxis, 0, 4);
var response = array.arraySlice(bandAxis, 4);
// [END earthengine__arrays04__harmonic_model]

// Solve for linear regression coefficients in three different ways.
// All three methods produce equivalent results, but some are easier.
// [START earthengine__arrays04__hard_way]
// Compute coefficients the hard way.
var coefficients1 = predictors.arrayTranspose().matrixMultiply(predictors)
  .matrixInverse().matrixMultiply(predictors.arrayTranspose())
    .matrixMultiply(response);
// [END earthengine__arrays04__hard_way]
// [START earthengine__arrays04__easy_way]
// Compute coefficients the easy way.
var coefficients2 = predictors.matrixPseudoInverse()
  .matrixMultiply(response);
// [END earthengine__arrays04__easy_way]
// [START earthengine__arrays04__easiest_way]
// Compute coefficients the easiest way.
var coefficients3 = predictors.matrixSolve(response);
// [END earthengine__arrays04__easiest_way]
// [START earthengine__arrays04__image_flatten]
// Turn the results into a multi-band image.
var coefficientsImage = coefficients3
  // Get rid of the extra dimensions.
  .arrayProject([0])
  .arrayFlatten([
    ['constant', 'trend', 'sin', 'cos']
]);
// [END earthengine__arrays04__image_flatten]

// Use this mask for cartographic purposes, to get rid of water areas.
var mask = ee.Image('CGIAR/SRTM90_V4').mask();

// Display the result.
Map.setCenter(-122.08709, 36.9732, 13);
Map.addLayer(coefficientsImage.updateMask(mask), {
  bands: ['sin', 'trend', 'cos'],
  min: [-0.05, -0.1, -0.05],
  max: [0.05, 0.1, 0.05],
});

// Map a function over the collection to compute the fitted values at each time.
var fitted = collection.map(makeVariables).map(function(image) {
  var coeffs = coefficientsImage.select(['constant', 'trend', 'sin', 'cos']);
  var predicted = image
    .select(['constant', 't', 'sin', 'cos'])
    .multiply(coeffs)
    .reduce('sum')
    .rename('fitted');
  return image.select('NDVI').addBands(predicted);
});

// Define a point that expresses a seasonal NDVI pattern.
var roi = ee.Geometry.Point(-122.08709, 36.9732).buffer(120);

// Plot the results.
print(Chart.image.series(
    fitted.select(['fitted','NDVI']), roi, ee.Reducer.mean(), 30)
    .setChartType('LineChart')
    .setSeriesNames(['Orig', 'Fitted'])
    .setOptions({
      title: 'Original and fitted NDVI values',
      lineWidth: 1,
      pointSize: 3,
      fontSize: 16
}));
