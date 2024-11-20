/**
 * Copyright 2024 The Google Earth Engine Community Authors
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

/**
 * @fileoverview Google Earth Engine Developer's Guide examples for
 *     'JavaScript Code Editor quickstart
 */

// [START earthengine__quickstart__image_load]
var jan2023Climate = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR')
  .filterDate('2023-01-01', '2023-02-01')
  .first();

print('jan2023Climate', jan2023Climate);
// [END earthengine__quickstart__image_load]

// [START earthengine__quickstart__image_display]
var visParams = {
  bands: ['temperature_2m'],
  min: 229,
  max: 304,
  palette: ['#000004', '#410967', '#932567', '#f16e43', '#fcffa4']
};

Map.addLayer(jan2023Climate, visParams, 'Temperature (K)');
Map.setCenter(0, 40, 2);
// [END earthengine__quickstart__image_display]

// [START earthengine__quickstart__fc_create]
var cities = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point(10.75, 59.91), {'city': 'Oslo'}),
  ee.Feature(ee.Geometry.Point(-118.24, 34.05), {'city': 'Los Angeles'}),
  ee.Feature(ee.Geometry.Point(103.83, 1.33), {'city': 'Singapore'}),
]);

print('cities', cities);
// [END earthengine__quickstart__fc_create]

// [START earthengine__quickstart__fc_display]
Map.addLayer(cities, null, 'Cities');
// [END earthengine__quickstart__fc_display]

// [START earthengine__quickstart__extract_data]
var cityClimates = jan2023Climate.reduceRegions(cities, ee.Reducer.first());

print('cityClimates', cityClimates);
// [END earthengine__quickstart__extract_data]

// [START earthengine__quickstart__plot_data]
var chart = ui.Chart.feature.byFeature(cityClimates, 'city', 'temperature_2m')
  .setChartType('ColumnChart')
  .setOptions({
    title: 'January 2023 temperature for selected cities',
    hAxis: {title: 'City'},
    vAxis: {title: 'Temperature (K)'},
    legend: {position: 'none'}
  });

print(chart);
// [END earthengine__quickstart__plot_data]