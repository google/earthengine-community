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
 *     from 'Chart.feature.by_' section
 */

// [START earthengine__charts08__feature_charts]
// Load a table of average seasonal temperatures in U.S. cities.
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

// Calculate Jan to Jul temperature difference per state and set as a property.
states = states.map(function(state) {
  var julyTemp = ee.Number(state.get('06_tmean'));
  var janTemp = ee.Number(state.get('01_tmean'));
  return state.set('seasonal_delta', julyTemp.subtract(janTemp));
});

// Select the extreme states.
var extremeStates =
  states.limit(1, '01_tmean')                 // Coldest.
  .merge(states.limit(1, '07_tmean', false))  // Hottest.
  .merge(states.limit(1, 'seasonal_delta'));  // Least variation.

// Define properties to chart.
var months = {
  '01_tmean': 1,
  '04_tmean': 4,
  '07_tmean': 7,
  '10_tmean': 10
};

// Prepare the chart.
var chart1 =
  ui.Chart.feature.byProperty(extremeStates, months, 'NAME')
    .setChartType('ScatterChart')
    .setOptions({
      title: 'Average Temperatures in U.S. States',
      hAxis: {
        title: 'Month',
        ticks: [{v: months['01_tmean'], f: 'January'},
                {v: months['04_tmean'], f: 'April'},
                {v: months['07_tmean'], f: 'July'},
                {v: months['10_tmean'], f: 'October'}]
      },
      vAxis: {
        title: 'Temperature (Celsius)'
      },
      lineWidth: 1,
      pointSize: 3
    });


// Make a chart by feature.
var chart2 =
  ui.Chart.feature.byFeature(extremeStates, 'NAME', Object.keys(months))
    .setChartType('ColumnChart')
    .setSeriesNames(['Jan', 'Apr', 'Jul', 'Oct'])
    .setOptions({
      title: 'Average Monthly Temperatures, by State',
      hAxis: {title: 'State'},
      vAxis: {title: 'Temperature (Celsius)'}
    });

// Print the charts.
print(chart1, chart2);
// [END earthengine__charts08__feature_charts]
