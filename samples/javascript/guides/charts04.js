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
 *     from 'ui.Chart.image.regions' section
 */

// [START earthengine__charts04__image_regions]
// Load and display a Landsat 8 image's reflective bands.
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_026047_20140216')
    .select(['B[1-7]']);
Map.addLayer(image, {bands: ['B5', 'B4', 'B3'], min: 0, max: 0.5});

// Define and display a FeatureCollection of three known locations.
var points = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point(-99.25260, 19.32235), {'label': 'park'}),
  ee.Feature(ee.Geometry.Point(-99.08992, 19.27868), {'label': 'farm'}),
  ee.Feature(ee.Geometry.Point(-99.21135, 19.31860), {'label': 'urban'})
]);
Map.addLayer(points);

// Define customization options.
var options = {
  title: 'Landsat 8 TOA spectra at three points near Mexico City',
  hAxis: {title: 'Wavelength (micrometers)'},
  vAxis: {title: 'Reflectance'},
  lineWidth: 1,
  pointSize: 4,
  series: {
    0: {color: '00FF00'}, // park
    1: {color: '0000FF'}, // farm
    2: {color: 'FF0000'}, // urban
}};

// Define a list of Landsat 8 wavelengths for X-axis labels.
var wavelengths = [0.44, 0.48, 0.56, 0.65, 0.86, 1.61, 2.2];

// Create the chart and set options.
var spectraChart = ui.Chart.image.regions(
    image, points, ee.Reducer.mean(), 30, 'label', wavelengths)
        .setChartType('ScatterChart')
        .setOptions(options);

// Display the chart.
print(spectraChart);
// [END earthengine__charts04__image_regions]
