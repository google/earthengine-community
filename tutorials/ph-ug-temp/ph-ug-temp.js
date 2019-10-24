/**
 * @license
 * Copyright 2019 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


// #############################################################################


// Objectives:
//
// 1. Import Land Surface Temperature (LST) data for 1 year in Uganda.
// 2. Describe the data using a time series chart.
// 3. Export processed raster data for use in GIS.


// #############################################################################


// Import country boundaries feature collection.
var dataset = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Apply filter where country name equals Uganda.
var ugandaBorder = dataset.filter(ee.Filter.eq('country_na', 'Uganda'));

// Print new "ugandaBorder" object and explorer features and properties.
// There should only be one feature representing Uganda.
print(ugandaBorder);

// Add Uganda outline to the Map as a layer.
Map.centerObject(ugandaBorder, 6);
Map.addLayer(ugandaBorder);


// #############################################################################


// Import LST image collection.
var modis = ee.ImageCollection('MODIS/MOD11A2');

// Define a date range of interest; here, a start date is defined and the end
// date is determined by advancing 1 year from the start date.
var start = ee.Date('2015-01-01');
var dateRange = ee.DateRange(start, start.advance(1, 'year'));

// Filter the LST collection to include only images intersecting the desired
// date range.
var mod11a2 = modis.filterDate(dateRange);

// Select only the 1km day LST data band.
var modLSTday = mod11a2.select('LST_Day_1km');


// #############################################################################


// Scale to Kelvin and convert to Celsius, set image acquisition time.
var modLSTc = modLSTday.map(function(img) {
  return img
    .multiply(0.02)
    .subtract(273.15)
    .copyProperties(img, ['system:time_start']);
});


// #############################################################################


// Chart time series of LST for Uganda in 2015.
var ts1 = ui.Chart.image.series({
  imageCollection: modLSTc,
  region: ugandaBorder,
  reducer: ee.Reducer.mean(),
  scale: 1000,
  xProperty: 'system:time_start'})
  .setOptions({
     title: 'LST 2015 Time Series',
     vAxis: {title: 'LST Celsius'}});
print(ts1);


// #############################################################################


// Calculate 8-day mean temperature for Uganda in 2015.
var clippedLSTc = modLSTc.mean().clip(ugandaBorder);

// Add clipped image layer to the map.
Map.addLayer(clippedLSTc, {
  min: 20, max: 40,
  palette: ['blue', 'limegreen', 'yellow', 'darkorange', 'red']},
  'Mean temperature, 2015');


// #############################################################################


// Export the image to your Google Drive account.
Export.image.toDrive({
  image: clippedLSTc,
  description: 'LST_Celsius_ug',
  folder: 'my_folder',
  region: ugandaBorder,
  scale: 1000,
  crs: 'EPSG:4326',
  maxPixels: 1e10});

