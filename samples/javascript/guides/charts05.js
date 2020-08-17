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
 *     from 'ui.Chart.image.seriesByRegion' section
 */

// [START earthengine__charts05__series_by_region]
// Define a FeatureCollection: regions of the American West.
var regions = ee.FeatureCollection([
  ee.Feature(    // San Francisco.
    ee.Geometry.Rectangle(-122.45, 37.74, -122.4, 37.8), {label: 'City'}),
  ee.Feature(  // Tahoe National Forest.
    ee.Geometry.Rectangle(-121, 39.4, -120.8, 39.8), {label: 'Forest'}),
  ee.Feature(  // Black Rock Desert.
    ee.Geometry.Rectangle(-119.15, 40.8, -119, 41), {label: 'Desert'})
]);

// Load Landsat 8 brightness temperature data for 1 year.
var temps2013 = ee.ImageCollection('LANDSAT/LC8_L1T_32DAY_TOA')
    .filterDate('2012-12-25', '2013-12-25')
    .select('B11');

// Create a time series chart.
var tempTimeSeries = ui.Chart.image.seriesByRegion(
    temps2013, regions, ee.Reducer.mean(), 'B11', 200, 'system:time_start', 'label')
        .setChartType('ScatterChart')
        .setOptions({
          title: 'Temperature over time in regions of the American West',
          vAxis: {title: 'Temperature (Kelvin)'},
          lineWidth: 1,
          pointSize: 4,
          series: {
            0: {color: 'FF0000'}, // urban
            1: {color: '00FF00'}, // forest
            2: {color: '0000FF'}  // desert
}});

// Display.
print(tempTimeSeries);
// [END earthengine__charts05__series_by_region]

