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

// [START earthengine__reducers15__image_linear_fit]
// Define a rectangle geometry around San Francisco.
var sanFrancisco = ee.Geometry.Rectangle([-122.45, 37.74, -122.4, 37.8]);

// Import a Landsat 8 TOA image for this region.
var img = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');

// Subset the SWIR1 and SWIR2 bands. In the regression reducer, independent
// variables come first followed by the dependent variables. In this case,
// B5 (SWIR1) is the independent variable and B6 (SWIR2) is the dependent
// variable.
var imgRegress = img.select(['B5', 'B6']);

// Calculate regression coefficients for the set of pixels intersecting the
// above defined region using reduceRegion with ee.Reducer.linearFit().
var linearFit = imgRegress.reduceRegion({
  reducer: ee.Reducer.linearFit(),
  geometry: sanFrancisco,
  scale: 30,
});

// Inspect the results.
print('OLS estimates:', linearFit);
print('y-intercept:', linearFit.get('offset'));
print('Slope:', linearFit.get('scale'));
// [END earthengine__reducers15__image_linear_fit]

// [START earthengine__reducers15__image_linear_regression]
// Define a rectangle geometry around San Francisco.
var sanFrancisco = ee.Geometry.Rectangle([-122.45, 37.74, -122.4, 37.8]);

// Import a Landsat 8 TOA image for this region.
var img = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');

// Create a new image that is the concatenation of three images: a constant,
// the SWIR1 band, and the SWIR2 band.
var constant = ee.Image(1);
var xVar = img.select('B5');
var yVar = img.select('B6');
var imgRegress = ee.Image.cat(constant, xVar, yVar);

// Calculate regression coefficients for the set of pixels intersecting the
// above defined region using reduceRegion. The numX parameter is set as 2
// because the constant and the SWIR1 bands are independent variables and they
// are the first two bands in the stack; numY is set as 1 because there is only
// one dependent variable (SWIR2) and it follows as band three in the stack.
var linearRegression = imgRegress.reduceRegion({
  reducer: ee.Reducer.linearRegression({
    numX: 2,
    numY: 1
  }),
  geometry: sanFrancisco,
  scale: 30,
});

// Convert the coefficients array to a list.
var coefList = ee.Array(linearRegression.get('coefficients')).toList();

// Extract the y-intercept and slope.
var b0 = ee.List(coefList.get(0)).get(0); // y-intercept
var b1 = ee.List(coefList.get(1)).get(0); // slope

// Extract the residuals.
var residuals = ee.Array(linearRegression.get('residuals')).toList().get(0);

// Inspect the results.
print('OLS estimates', linearRegression);
print('y-intercept:', b0);
print('Slope:', b1);
print('Residuals:', residuals);
// [END earthengine__reducers15__image_linear_regression]

// [START earthengine__reducers15__list_linear_fit]
// Define a list of lists, where columns represent variables. The first column
// is the independent variable and the second is the dependent variable.
var listsVarColumns = ee.List([
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5]
]);

// Compute the least squares estimate of a linear function. Note that an
// object is returned; cast it as an ee.Dictionary to make accessing the
// coefficients easier.
var linearFit = ee.Dictionary(listsVarColumns.reduce(ee.Reducer.linearFit()));

// Inspect the result.
print(linearFit);
print('y-intercept:', linearFit.get('offset'));
print('Slope:', linearFit.get('scale'));
// [END earthengine__reducers15__list_linear_fit]

// [START earthengine__reducers15__list_linear_fit_transpose]
// If variables in the list are arranged as rows, you'll need to transpose it.
// Define a list of lists where rows represent variables. The first row is the
// independent variable and the second is the dependent variable.
var listsVarRows = ee.List([
  [1, 2, 3, 4, 5],
  [1, 2, 3, 4, 5]
]);

// Cast the ee.List as an ee.Array, transpose it, and cast back to ee.List.
var listsVarColumns = ee.Array(listsVarRows).transpose().toList();

// Compute the least squares estimate of a linear function. Note that an
// object is returned; cast it as an ee.Dictionary to make accessing the
// coefficients easier.
var linearFit = ee.Dictionary(listsVarColumns.reduce(ee.Reducer.linearFit()));

// Inspect the result.
print(linearFit);
print('y-intercept:', linearFit.get('offset'));
print('Slope:', linearFit.get('scale'));
// [END earthengine__reducers15__list_linear_fit_transpose]

// [START earthengine__reducers15__list_linear_regression]
// Define a list of lists where columns represent variables. The first column
// represents a constant term, the second an independent variable, and the third
// a dependent variable.
var listsVarColumns = ee.List([
  [1, 1, 1],
  [1, 2, 2],
  [1, 3, 3],
  [1, 4, 4],
  [1, 5, 5]
]);

// Compute ordinary least squares regression coefficients. numX is 2 because
// there is one constant term and an additional independent variable. numY is 1
// because there is only a single dependent variable. Cast the resulting
// object to an ee.Dictionary for easy access to the properties.
var linearRegression = ee.Dictionary(
  listsVarColumns.reduce(ee.Reducer.linearRegression({
    numX: 2,
    numY: 1
})));

// Convert the coefficients array to a list.
var coefList = ee.Array(linearRegression.get('coefficients')).toList();

// Extract the y-intercept and slope.
var b0 = ee.List(coefList.get(0)).get(0); // y-intercept
var b1 = ee.List(coefList.get(1)).get(0); // slope

// Extract the residuals.
var residuals = ee.Array(linearRegression.get('residuals')).toList().get(0);

// Inspect the results.
print('OLS estimates', linearRegression);
print('y-intercept:', b0);
print('Slope:', b1);
print('Residuals:', residuals);
// [END earthengine__reducers15__list_linear_regression]

// [START earthengine__reducers15__fc_linear_regression]
// Import a Sentinel-2 TOA image.
var s2ImgSwir1 = ee.Image('COPERNICUS/S2/20191022T185429_20191022T185427_T10SEH');

// Import a Landsat 8 TOA image from 12 days earlier than the S2 image.
var l8ImgSwir1 = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044033_20191010');

// Get the intersection between the two images - the area of interest (aoi).
var aoi = s2ImgSwir1.geometry().intersection(l8ImgSwir1.geometry());

// Get a set of 1000 random points from within the aoi. A feature collection
// is returned.
var sample = ee.FeatureCollection.randomPoints({
  region: aoi,
  points: 1000
});

// Combine the SWIR1 bands from each image into a single image.
var swir1Bands = s2ImgSwir1.select('B11')
  .addBands(l8ImgSwir1.select('B6'))
  .rename(['s2_swir1', 'l8_swir1']);

// Sample the SWIR1 bands using the sample point feature collection.
var imgSamp = swir1Bands.sampleRegions({
  collection: sample,
  scale: 30
})
// Add a constant property to each feature to be used as an independent variable.
.map(function(feature) {
  return feature.set('constant', 1);
});

// Compute linear regression coefficients. numX is 2 because
// there are two independent variables: 'constant' and 's2_swir1'. numY is 1
// because there is a single dependent variable: 'l8_swir1'. Cast the resulting
// object to an ee.Dictionary for easy access to the properties.
var linearRegression = ee.Dictionary(imgSamp.reduceColumns({
  reducer: ee.Reducer.linearRegression({
    numX: 2,
    numY: 1
  }),
  selectors: ['constant', 's2_swir1', 'l8_swir1']
}));

// Convert the coefficients array to a list.
var coefList = ee.Array(linearRegression.get('coefficients')).toList();

// Extract the y-intercept and slope.
var yInt = ee.List(coefList.get(0)).get(0); // y-intercept
var slope = ee.List(coefList.get(1)).get(0); // slope

// Gather the SWIR1 values from the point sample into a list of lists.
var props = ee.List(['s2_swir1', 'l8_swir1']);
var regressionVarsList = ee.List(imgSamp.reduceColumns({
  reducer: ee.Reducer.toList().repeat(props.size()),
  selectors: props
}).get('list'));

// Convert regression x and y variable lists to an array - used later as input
// to ui.Chart.array.values for generating a scatter plot.
var x = ee.Array(ee.List(regressionVarsList.get(0)));
var y1 = ee.Array(ee.List(regressionVarsList.get(1)));

// Apply the line function defined by the slope and y-intercept of the
// regression to the x variable list to create an array that will represent
// the regression line in the scatter plot.
var y2 = ee.Array(ee.List(regressionVarsList.get(0)).map(function(x) {
  var y = ee.Number(x).multiply(slope).add(yInt);
  return y;
}));

// Concatenate the y variables (Landsat 8 SWIR1 and predicted y) into an array
// for input to ui.Chart.array.values for plotting a scatter plot.
var yArr = ee.Array.cat([y1, y2], 1);

// Make a scatter plot of the two SWIR1 bands for the point sample and include
// the least squares line of best fit through the data.
print(ui.Chart.array.values({
  array: yArr,
  axis: 0,
  xLabels: x})
  .setChartType('ScatterChart')
  .setOptions({
    legend: {position: 'none'},
    hAxis: {'title': 'Sentinel-2 SWIR1'},
    vAxis: {'title': 'Landsat 8 SWIR1'},
    series: {
      0: {
        pointSize: 0.2,
        dataOpacity: 0.5,
      },
      1: {
        pointSize: 0,
        lineWidth: 2,
      }
    }
  })
);
// [END earthengine__reducers15__fc_linear_regression]

