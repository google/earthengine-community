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
 *     from ee.ImageCollection charting section
 */

// [START earthengine__charts_image_collection__doy_series_line_chart]
// Import the example feature collection and subset the grassland feature.
var grassland = ee.FeatureCollection('projects/google/charts_feature_example')
                    .filter(ee.Filter.eq('label', 'Grassland'));

// Load MODIS vegetation indices data and subset a decade of images.
var vegIndices = ee.ImageCollection('MODIS/006/MOD13A1')
                     .filter(ee.Filter.date('2010-01-01', '2020-01-01'))
                     .select(['NDVI', 'EVI']);

// Define the chart and print it to the console.
var chart =
    ui.Chart.image
        .doySeries({
          imageCollection: vegIndices,
          region: grassland,
          regionReducer: ee.Reducer.mean(),
          scale: 500,
          yearReducer: ee.Reducer.mean(),
          startDay: 1,
          endDay: 365
        })
        .setSeriesNames(['EVI', 'NDVI'])
        .setOptions({
          title: 'Average Vegetation Index Value by Day of Year for Grassland',
          hAxis: {
            title: 'Day of year',
            titleTextStyle: {italic: false, bold: true}
          },
          vAxis: {
            title: 'Vegetation index (x1e4)',
            titleTextStyle: {italic: false, bold: true}
          },
          lineWidth: 5,
          colors: ['e37d05', '1d6b99'],
        });
print(chart);
// [END earthengine__charts_image_collection__doy_series_line_chart]

// [START earthengine__charts_image_collection__doy_series_by_year_line_chart]
// Import the example feature collection and subset the grassland feature.
var grassland = ee.FeatureCollection('projects/google/charts_feature_example')
                    .filter(ee.Filter.eq('label', 'Grassland'));

// Load MODIS vegetation indices data and subset years 2012 and 2019.
var vegIndices = ee.ImageCollection('MODIS/006/MOD13A1')
                     .filter(ee.Filter.or(
                         ee.Filter.date('2012-01-01', '2013-01-01'),
                         ee.Filter.date('2019-01-01', '2020-01-01')))
                     .select(['NDVI', 'EVI']);

// Define the chart and print it to the console.
var chart = ui.Chart.image
                .doySeriesByYear({
                  imageCollection: vegIndices,
                  bandName: 'NDVI',
                  region: grassland,
                  regionReducer: ee.Reducer.mean(),
                  scale: 500,
                  sameDayReducer: ee.Reducer.mean(),
                  startDay: 1,
                  endDay: 365
                })
                .setOptions({
                  title: 'Average NDVI Value by Day of Year for Grassland',
                  hAxis: {
                    title: 'Day of year',
                    titleTextStyle: {italic: false, bold: true}
                  },
                  vAxis: {
                    title: 'NDVI (x1e4)',
                    titleTextStyle: {italic: false, bold: true}
                  },
                  lineWidth: 5,
                  colors: ['39a8a7', '9c4f97'],
                });
print(chart);
// [END earthengine__charts_image_collection__doy_series_by_year_line_chart]

// [START earthengine__charts_image_collection__doy_series_by_region_line_chart]
// Import the example feature collection.
var ecoregions = ee.FeatureCollection('projects/google/charts_feature_example');

// Load MODIS vegetation indices data and subset a decade of images.
var vegIndices = ee.ImageCollection('MODIS/006/MOD13A1')
                     .filter(ee.Filter.date('2010-01-01', '2020-01-01'))
                     .select(['NDVI', 'EVI']);

// Define the chart and print it to the console.
var chart = ui.Chart.image
                .doySeriesByRegion({
                  imageCollection: vegIndices,
                  bandName: 'NDVI',
                  regions: ecoregions,
                  regionReducer: ee.Reducer.mean(),
                  scale: 500,
                  yearReducer: ee.Reducer.mean(),
                  seriesProperty: 'label',
                  startDay: 1,
                  endDay: 365
                })
                .setOptions({
                  title: 'Average NDVI Value by Day of Year',
                  hAxis: {
                    title: 'Day of year',
                    titleTextStyle: {italic: false, bold: true}
                  },
                  vAxis: {
                    title: 'NDVI (x1e4)',
                    titleTextStyle: {italic: false, bold: true}
                  },
                  lineWidth: 5,
                  colors: ['f0af07', '0f8755', '76b349'],
                });
print(chart);
// [END earthengine__charts_image_collection__doy_series_by_region_line_chart]

// [START earthengine__charts_image_collection__series_line_chart]
// Import the example feature collection and subset the forest feature.
var forest = ee.FeatureCollection('projects/google/charts_feature_example')
                 .filter(ee.Filter.eq('label', 'Forest'));

// Load MODIS vegetation indices data and subset a decade of images.
var vegIndices = ee.ImageCollection('MODIS/006/MOD13A1')
                     .filter(ee.Filter.date('2010-01-01', '2020-01-01'))
                     .select(['NDVI', 'EVI']);

// Define the chart and print it to the console.
var chart =
    ui.Chart.image
        .series({
          imageCollection: vegIndices,
          region: forest,
          reducer: ee.Reducer.mean(),
          scale: 500,
          xProperty: 'system:time_start'
        })
        .setSeriesNames(['EVI', 'NDVI'])
        .setOptions({
          title: 'Average Vegetation Index Value by Date for Forest',
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
// [END earthengine__charts_image_collection__series_line_chart]

// [START earthengine__charts_image_collection__series_by_region_chart]
// Import the example feature collection.
var ecoregions = ee.FeatureCollection('projects/google/charts_feature_example');

// Load MODIS vegetation indices data and subset a decade of images.
var vegIndices = ee.ImageCollection('MODIS/006/MOD13A1')
                     .filter(ee.Filter.date('2010-01-01', '2020-01-01'))
                     .select(['NDVI', 'EVI']);

// Define the chart and print it to the console.
var chart =
    ui.Chart.image
        .seriesByRegion({
          imageCollection: vegIndices,
          band: 'NDVI',
          regions: ecoregions,
          reducer: ee.Reducer.mean(),
          scale: 500,
          seriesProperty: 'label',
          xProperty: 'system:time_start'
        })
        .setOptions({
          title: 'Average NDVI Value by Date',
          hAxis: {title: 'Date', titleTextStyle: {italic: false, bold: true}},
          vAxis: {
            title: 'NDVI (x1e4)',
            titleTextStyle: {italic: false, bold: true}
          },
          lineWidth: 5,
          colors: ['f0af07', '0f8755', '76b349'],
        });
print(chart);
// [END earthengine__charts_image_collection__series_by_region_chart]
