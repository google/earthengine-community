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
 *   from 'Chart.array.values' section
 */

// [START earthengine__charts10__array_values]
// Define an arbitrary region of interest.
var sanFrancisco = ee.Geometry.Rectangle([-122.45, 37.74, -122.4, 37.8]);

// Load a Landsat 8 image.
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');

// Get a dictionary with band names as keys, pixel lists as values.
var result = image.reduceRegion(ee.Reducer.toList(), sanFrancisco, 120);

// Convert the band data to plot on the y-axis to arrays.
var y1 = ee.Array(result.get('B5'));
var y2 = ee.Array(result.get('B6'));
// Concatenate the y-axis data by stacking the arrays on the 1-axis.
var yValues = ee.Array.cat([y1, y2], 1);

// The band data to plot on the x-axis is a List.
var xValues = result.get('B4');

// Make a band correlation chart.
var chart = ui.Chart.array.values(yValues, 0, xValues)
    .setSeriesNames(['B5', 'B6'])
    .setOptions({
      title: 'LC8 TOA B4 vs. {B5,B6}',
      hAxis: {'title': 'B4'},
      vAxis: {'title': '{B5,B6}'},
      pointSize: 3,
});

// Print the chart.
print(chart);
// [END earthengine__charts10__array_values]
