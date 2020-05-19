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
 *     from 'ui.Chart.feature.groups' section
 */

// [START earthengine__charts09__feature_groups]
// Import US state boundaries.
var states = ee.FeatureCollection('TIGER/2018/States');

// Import temperature normals and convert month features to bands.
var normClim = ee.ImageCollection('OREGONSTATE/PRISM/Norm81m')
  .select(['tmean'])
  .toBands();

// Calculate mean monthly temperature per state.
states = normClim.reduceRegions({
  collection: states,
  reducer: ee.Reducer.mean(),
  scale: 5e4})
  .filter(ee.Filter.notNull(['01_tmean']));

// Define groups in the data by mapping a function to set a new property.
var grouped = states.map(function(feature) {
  var skiable = ee.Number(feature.get('01_tmean')).lte(0);
  return feature.set('skiing', skiable);
});

// Create the chart.
var chart = ui.Chart.feature.groups(
    grouped, '01_tmean', '07_tmean', 'skiing'
  )
  .setChartType('ScatterChart')
  .setOptions({
    hAxis: {title: 'Average January Temperature (C)'},
    vAxis: {title: 'Average July Temperature (C)'},
  }).setSeriesNames(["ski", "don't ski"]);

// Print the chart.
print(chart);
// [END earthengine__charts09__feature_groups]
