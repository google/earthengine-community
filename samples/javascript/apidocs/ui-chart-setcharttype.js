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

// [START earthengine__apidocs__ui_chart_setcharttype]
// A data table of population for selected states.
var dataTable = [
  [{role: 'domain', label: 'State'}, {role: 'data', label: 'Population'}],
  ['CA', 37253956],
  ['NY', 19378102],
  ['IL', 12830632],
  ['MI', 9883640],
  ['OR', 3831074],
];

// Chart the data using accepted chart types.
print('Scatter chart', ui.Chart(dataTable).setChartType('ScatterChart'));
print('Line chart', ui.Chart(dataTable).setChartType('LineChart'));
print('Column chart', ui.Chart(dataTable).setChartType('ColumnChart'));
print('Bar chart', ui.Chart(dataTable).setChartType('BarChart'));
print('Pie chart', ui.Chart(dataTable).setChartType('PieChart'));
print('Area chart', ui.Chart(dataTable).setChartType('AreaChart'));
print('Table', ui.Chart(dataTable).setChartType('Table'));
// [END earthengine__apidocs__ui_chart_setcharttype]
