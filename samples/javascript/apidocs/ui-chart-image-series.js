/**
 * Copyright 2022 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ui_chart_image_series]
// Define a region of pixels to reduce and chart a time series for.
var region = ee.Geometry.BBox(-121.916, 37.130, -121.844, 37.076);

// Define an image collection time series to chart, MODIS vegetation indices
// in this case.
var imgCol = ee.ImageCollection('MODIS/006/MOD13A1')
  .filter(ee.Filter.date('2015-01-01', '2020-01-01'))
  .select(['NDVI', 'EVI']);

// Define the chart and print it to the console.
var chart = ui.Chart.image.series({
  imageCollection: imgCol,
  region: region,
  reducer: ee.Reducer.mean(),
  scale: 500,
  xProperty: 'system:time_start'
})
.setSeriesNames(['EVI', 'NDVI'])
.setOptions({
  title: 'Average Vegetation Index Value by Date',
  hAxis: {title: 'Date', titleTextStyle: {italic: false, bold: true}},
  vAxis: {
    title: 'Vegetation index (x1e4)',
    titleTextStyle: {italic: false, bold: true}
  },
  lineWidth: 5,
  colors: ['e37d05', '1d6b99'],
  curveType: 'function'
});
print(chart);
// [END earthengine__apidocs__ui_chart_image_series]
