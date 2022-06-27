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

// [START earthengine__apidocs__ui_chart_image_histogram]
// Define a MODIS surface reflectance composite.
var modisSr = ee.ImageCollection('MODIS/006/MOD09A1')
                  .filter(ee.Filter.date('2018-06-01', '2018-09-01'))
                  .select(['sur_refl_b01', 'sur_refl_b02', 'sur_refl_b06'])
                  .mean();

// Define a region to calculate histogram for.
var histRegion = ee.Geometry.Rectangle([-112.60, 40.60, -111.18, 41.22]);

// Define the chart and print it to the console.
var chart =
    ui.Chart.image.histogram({image: modisSr, region: histRegion, scale: 500})
        .setSeriesNames(['Red', 'NIR', 'SWIR'])
        .setOptions({
          title: 'MODIS SR Reflectance Histogram',
          hAxis: {
            title: 'Reflectance (scaled by 1e4)',
            titleTextStyle: {italic: false, bold: true},
          },
          vAxis:
              {title: 'Count', titleTextStyle: {italic: false, bold: true}},
          colors: ['cf513e', '1d6b99', 'f0af07']
        });
print(chart);
// [END earthengine__apidocs__ui_chart_image_histogram]
