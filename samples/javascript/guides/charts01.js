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
 *     from 'Charts - introduction' section
 */

// [START earthengine__charts01__data_table]
// Define a DataTable using a JavaScript literal.
var dataTable = {
  cols: [{id: 'name', label: 'Airport Code', type: 'string'},
         {id: 'year', label: 'Elevation (m)', type: 'number'}],
  rows: [{c: [{v: 'SFO'}, {v: 4}]},
         {c: [{v: 'JFK'}, {v: 4}]},
         {c: [{v: 'DEN'}, {v: 1655}]},
         {c: [{v: 'LHR'}, {v: 25}]},
         {c: [{v: 'ZRH'}, {v: 432}]}]
};
// [END earthengine__charts01__data_table]

// [START earthengine__charts01__options_dictionary]
// Define a dictionary of customization options.
var options = {
  title: 'Airport elevations',
  vAxis: {title: 'Airport Code'},
  legend: {position: 'none'},
  hAxis: {
    title: 'Elevation (m)',
    logScale: true
  }
};
// [END earthengine__charts01__options_dictionary]

// [START earthengine__charts01__create_display]
// Make a BarChart from the table and the options.
var chart = new ui.Chart(dataTable, 'BarChart', options);

// Print the chart to display it in the console.
print(chart);
// [END earthengine__charts01__create_display]
