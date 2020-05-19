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
 *     from 'ui.Chart.image.byClass' section
 */

// [START earthengine__charts07__image_by_class]
// Load a region representing Rhode Island state.
var rhodeIsland = ee.Feature(ee.FeatureCollection('TIGER/2016/States')
                                 .filter(ee.Filter.eq('NAME', 'Rhode Island'))
                                 .first());

// Define a broad list of land cover categories.
var classNames = ee.List(['Water', 'Forest', 'Shrub', 'Grass', 'Urban']);

// Load MODIS land cover data.
var classifiedImage = ee.Image('MODIS/051/MCD12Q1/2012_01_01')
    // Select the IGBP classification.
    .select(['Land_Cover_Type_1'])
    // Reclassify to the broad categories.
    .remap([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
           [0,1,1,1,1,1,2,2,1,3,3,0,3,4,3,0,4,0]);

// Load Landsat 8 TOA reflectance, add the IGBP band.
var image = ee.Image('LANDSAT/LC8_L1T_32DAY_TOA/20130407')
    .select('B[1-7]')
    .addBands(classifiedImage);

// Define a list of Landsat 8 wavelengths for X-axis labels.
var wavelengths = [0.44, 0.48, 0.56, 0.65, 0.86, 1.61, 2.2];

// Define chart customization options.
var options = {
  lineWidth: 1,
  pointSize: 2,
  hAxis: {title: 'Wavelength (micrometers)'},
  vAxis: {title: 'Reflectance'},
  title: 'Spectra in classified regions of Rhode Island'
};

// Make the chart, set the options.
var chart = ui.Chart.image.byClass(
    image, 'remapped', rhodeIsland, ee.Reducer.mean(), 500, classNames, wavelengths)
    .setOptions(options);

// Print the chart.
print(chart);
// [END earthengine__charts07__image_by_class]
