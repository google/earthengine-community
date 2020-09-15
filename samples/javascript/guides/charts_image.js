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
 *     from ee.Image charting section
 */

// [START earthengine__charts_image__by_region_column_chart]
// Import the example feature collection.
var ecoregions = ee.FeatureCollection('projects/google/charts_feature_example');

// Load PRISM climate normals image collection; convert images to bands.
var normClim = ee.ImageCollection('OREGONSTATE/PRISM/Norm81m').toBands();

// Define the chart and print it to the console.
var chart =
    ui.Chart.image
        .byRegion({
          image: normClim.select('[0-9][0-9]_tmean'),
          regions: ecoregions,
          reducer: ee.Reducer.mean(),
          scale: 500,
          xProperty: 'label'
        })
        .setSeriesNames([
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
          'Nov', 'Dec'
        ])
        .setChartType('ColumnChart')
        .setOptions({
          title: 'Average Monthly Temperature by Ecoregion',
          hAxis:
              {title: 'Ecoregion', titleTextStyle: {italic: false, bold: true}},
          vAxis: {
            title: 'Temperature (°C)',
            titleTextStyle: {italic: false, bold: true}
          },
          colors: [
            '604791', '1d6b99', '39a8a7', '0f8755', '76b349', 'f0af07',
            'e37d05', 'cf513e', '96356f', '724173', '9c4f97', '696969'
          ]
        });
print(chart);
// [END earthengine__charts_image__by_region_column_chart]

// [START earthengine__charts_image__by_region_bar_chart]
var chart =
    ui.Chart.image
        .byRegion({
          image: normClim.select('[0-9][0-9]_tmean'),
          regions: ecoregions,
          reducer: ee.Reducer.mean(),
          scale: 500,
          xProperty: 'label'
        })
        .setSeriesNames([
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
          'Nov', 'Dec'
        ])
        .setChartType('BarChart')
        .setOptions({
          title: 'Average Monthly Temperature by Ecoregion',
          hAxis: {
            title: 'Temperature (°C)',
            titleTextStyle: {italic: false, bold: true}
          },
          vAxis:
              {title: 'Ecoregion', titleTextStyle: {italic: false, bold: true}},
          colors: [
            '604791', '1d6b99', '39a8a7', '0f8755', '76b349', 'f0af07',
            'e37d05', 'cf513e', '96356f', '724173', '9c4f97', '696969'
          ]
        });
// [END earthengine__charts_image__by_region_bar_chart]

// [START earthengine__charts_image__by_region_stacked_bar_chart_absolute]
// Import the example feature collection.
var ecoregions = ee.FeatureCollection('projects/google/charts_feature_example');

// Load PRISM climate normals image collection; convert images to bands.
var normClim = ee.ImageCollection('OREGONSTATE/PRISM/Norm81m').toBands();

// Define the chart and print it to the console.
var chart =
    ui.Chart.image
        .byRegion({
          image: normClim.select('[0-9][0-9]_ppt'),
          regions: ecoregions,
          reducer: ee.Reducer.mean(),
          scale: 500,
          xProperty: 'label'
        })
        .setSeriesNames([
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
          'Nov', 'Dec'
        ])
        .setChartType('ColumnChart')
        .setOptions({
          title: 'Average Monthly Precipitation by Ecoregion',
          hAxis:
              {title: 'Ecoregion', titleTextStyle: {italic: false, bold: true}},
          vAxis: {
            title: 'Precipitation (mm)',
            titleTextStyle: {italic: false, bold: true}
          },
          colors: [
            '604791', '1d6b99', '39a8a7', '0f8755', '76b349', 'f0af07',
            'e37d05', 'cf513e', '96356f', '724173', '9c4f97', '696969'
          ],
          isStacked: 'absolute'
        });
print(chart);
// [END earthengine__charts_image__by_region_stacked_bar_chart_absolute]

// [START earthengine__charts_image__by_region_stacked_bar_chart_relative]
var chart =
    ui.Chart.image
        .byRegion({
          image: normClim.select('[0-9][0-9]_ppt'),
          regions: ecoregions,
          reducer: ee.Reducer.mean(),
          scale: 500,
          xProperty: 'label'
        })
        .setSeriesNames([
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
          'Nov', 'Dec'
        ])
        .setChartType('ColumnChart')
        .setOptions({
          title: 'Average Monthly Precipitation by Ecoregion',
          hAxis:
              {title: 'Ecoregion', titleTextStyle: {italic: false, bold: true}},
          vAxis: {
            title: 'Precipitation (mm)',
            titleTextStyle: {italic: false, bold: true}
          },
          colors: [
            '604791', '1d6b99', '39a8a7', '0f8755', '76b349', 'f0af07',
            'e37d05', 'cf513e', '96356f', '724173', '9c4f97', '696969'
          ],
          isStacked: 'relative'
        });
// [END earthengine__charts_image__by_region_stacked_bar_chart_relative]

// [START earthengine__charts_image__by_region_scatter_chart]
// Load SRTM elevation data.
var elev = ee.Image('CGIAR/SRTM90_V4').select('elevation');

// Subset Colorado from the TIGER States feature collection.
var colorado = ee.FeatureCollection('TIGER/2018/States')
                   .filter(ee.Filter.eq('NAME', 'Colorado'));

// Draw a random sample of elevation points from within Colorado.
var samp = elev.sample(
    {region: colorado, scale: 30, numPixels: 500, geometries: true});

// Load PRISM climate normals image collection; convert images to bands.
var normClim = ee.ImageCollection('OREGONSTATE/PRISM/Norm81m').toBands();

// Define the chart and print it to the console.
var chart = ui.Chart.image
                .byRegion({
                  image: normClim.select(['01_tmean', '07_tmean']),
                  regions: samp,
                  reducer: ee.Reducer.mean(),
                  scale: 500,
                  xProperty: 'elevation'
                })
                .setSeriesNames(['Jan', 'Jul'])
                .setChartType('ScatterChart')
                .setOptions({
                  title: 'Average Monthly Colorado Temperature by Elevation',
                  hAxis: {
                    title: 'Elevation (m)',
                    titleTextStyle: {italic: false, bold: true}
                  },
                  vAxis: {
                    title: 'Temperature (°C)',
                    titleTextStyle: {italic: false, bold: true}
                  },
                  pointSize: 4,
                  dataOpacity: 0.6,
                  colors: ['1d6b99', 'cf513e'],
                });
print(chart);
// [END earthengine__charts_image__by_region_scatter_chart]

// [START earthengine__charts_image__by_region_column_point_chart]
// Import the example feature collection.
var ecoregions = ee.FeatureCollection('projects/google/charts_feature_example');

// Load PRISM climate normals image collection; convert images to bands.
var normClim = ee.ImageCollection('OREGONSTATE/PRISM/Norm81m').toBands();

// Define the chart and print it to the console.
var chart =
    ui.Chart.image
        .byRegion({
          image: normClim.select(['06_tmean', '06_ppt']),
          regions: ecoregions,
          reducer: ee.Reducer.mean(),
          scale: 500,
          xProperty: 'label'
        })
        .setSeriesNames(['Precipitation', 'Temperature'])
        .setChartType('ColumnChart')
        .setOptions({
          title: 'Average June Temperature and Precipitation by Ecoregion',
          series: {
            0: {targetAxisIndex: 1, type: 'bar', color: '1d6b99'},
            1: {
              targetAxisIndex: 0,
              type: 'line',
              lineWidth: 0,
              pointSize: 10,
              color: 'e37d05'
            }
          },
          hAxis:
              {title: 'Ecoregion', titleTextStyle: {italic: false, bold: true}},
          vAxes: {
            0: {
              title: 'Temperature (°C)',
              baseline: 0,
              titleTextStyle: {italic: false, bold: true, color: 'e37d05'}
            },
            1: {
              title: 'Precipitation (mm)',
              titleTextStyle: {italic: false, bold: true, color: '1d6b99'}
            },
          },
          bar: {groupWidth: '40%'},
        });
print(chart);
// [END earthengine__charts_image__by_region_column_point_chart]

// [START earthengine__charts_image__regions_column_chart]
// Import the example feature collection.
var ecoregions = ee.FeatureCollection('projects/google/charts_feature_example');

// Load PRISM climate normals image collection, convert images to bands, and
// subset precipitation bands.
var precip = ee.ImageCollection('OREGONSTATE/PRISM/Norm81m')
                 .toBands()
                 .select('[0-9][0-9]_ppt');

// Define a dictionary that associates band names with values and labels.
var precipInfo = {
  '01_ppt': {v: 1, f: 'Jan'},
  '02_ppt': {v: 2, f: 'Feb'},
  '03_ppt': {v: 3, f: 'Mar'},
  '04_ppt': {v: 4, f: 'Apr'},
  '05_ppt': {v: 5, f: 'May'},
  '06_ppt': {v: 6, f: 'Jun'},
  '07_ppt': {v: 7, f: 'Jul'},
  '08_ppt': {v: 8, f: 'Aug'},
  '09_ppt': {v: 9, f: 'Sep'},
  '10_ppt': {v: 10, f: 'Oct'},
  '11_ppt': {v: 11, f: 'Nov'},
  '12_ppt': {v: 12, f: 'Dec'}
};

// Organize precipitation information into objects for defining x values and
// their tick labels. Note that chart options provided to the .setOptions()
// function must be client-side objects, which is why a client-side for
// loop is used to iteratively populate lists from the above dictionary.
var xPropVals = [];    // List to codify x-axis band names as values.
var xPropLabels = [];  // Holds dictionaries that label codified x-axis values.
for (var key in precipInfo) {
  xPropVals.push(precipInfo[key].v);
  xPropLabels.push(precipInfo[key]);
}

// Define the chart and print it to the console.
var chart = ui.Chart.image
                .regions({
                  image: precip,
                  regions: ecoregions,
                  reducer: ee.Reducer.mean(),
                  scale: 5e3,
                  seriesProperty: 'label',
                  xLabels: xPropVals
                })
                .setChartType('ColumnChart')
                .setOptions({
                  title: 'Average Ecoregion Precipitation by Month',
                  hAxis: {
                    title: 'Month',
                    titleTextStyle: {italic: false, bold: true},
                    ticks: xPropLabels
                  },
                  vAxis: {
                    title: 'Precipitation (mm)',
                    titleTextStyle: {italic: false, bold: true}
                  },
                  colors: ['f0af07', '0f8755', '76b349'],
                });
print(chart);
// [END earthengine__charts_image__regions_column_chart]

// [START earthengine__charts_image__regions_line_chart]
var chart = ui.Chart.image
                .regions({
                  image: precip,
                  regions: ecoregions,
                  reducer: ee.Reducer.mean(),
                  scale: 500,
                  seriesProperty: 'label',
                  xLabels: xPropVals
                })
                .setChartType('LineChart')
                .setOptions({
                  title: 'Average Ecoregion Precipitation by Month',
                  hAxis: {
                    title: 'Month',
                    titleTextStyle: {italic: false, bold: true},
                    ticks: xPropLabels
                  },
                  vAxis: {
                    title: 'Precipitation (mm)',
                    titleTextStyle: {italic: false, bold: true}
                  },
                  colors: ['f0af07', '0f8755', '76b349'],
                  lineSize: 5
                });
// [END earthengine__charts_image__regions_line_chart]

// [START earthengine__charts_image__regions_area_chart]
var chart = ui.Chart.image
                .regions({
                  image: precip,
                  regions: ecoregions,
                  reducer: ee.Reducer.mean(),
                  scale: 500,
                  seriesProperty: 'label',
                  xLabels: xPropVals
                })
                .setChartType('AreaChart')
                .setOptions({
                  title: 'Average Ecoregion Precipitation by Month',
                  hAxis: {
                    title: 'Month',
                    titleTextStyle: {italic: false, bold: true},
                    ticks: xPropLabels
                  },
                  vAxis: {
                    title: 'Precipitation (mm)',
                    titleTextStyle: {italic: false, bold: true}
                  },
                  colors: ['f0af07', '0f8755', '76b349'],
                  lineSize: 5
                });
// [END earthengine__charts_image__regions_area_chart]

// [START earthengine__charts_image__regions_pie_chart]
// Import the example feature collection, subset the forest ecoregion.
var forest = ee.FeatureCollection('projects/google/charts_feature_example')
                 .filter(ee.Filter.eq('label', 'Forest'));

// Load PRISM climate normals image collection, convert images to bands.
var normClim = ee.ImageCollection('OREGONSTATE/PRISM/Norm81m').toBands();

// Define x-axis labels to replace default band names.
var monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov',
  'Dec'
];

// Define the chart and print it to the console.
var chart = ui.Chart.image
                .regions({
                  image: normClim.select('[0-9][0-9]_ppt'),
                  regions: forest,
                  reducer: ee.Reducer.mean(),
                  scale: 5e3,
                  seriesProperty: 'label',
                  xLabels: monthNames
                })
                .setChartType('PieChart')
                .setOptions({
                  title: 'Average Monthly Precipitation for Forest Ecoregion',
                  colors: [
                    '604791', '1d6b99', '39a8a7', '0f8755', '76b349', 'f0af07',
                    'e37d05', 'cf513e', '96356f', '724173', '9c4f97', '696969'
                  ]
                });
print(chart);
// [END earthengine__charts_image__regions_pie_chart]

// [START earthengine__charts_image__regions_donut_chart]
var chart = ui.Chart.image
                .regions({
                  image: normClim.select('[0-9][0-9]_ppt'),
                  regions: forest,
                  reducer: ee.Reducer.mean(),
                  scale: 5e3,
                  seriesProperty: 'label',
                  xLabels: monthNames
                })
                .setChartType('PieChart')
                .setOptions({
                  title: 'Average Monthly Precipitation for Forest Ecoregion',
                  colors: [
                    '604791', '1d6b99', '39a8a7', '0f8755', '76b349', 'f0af07',
                    'e37d05', 'cf513e', '96356f', '724173', '9c4f97', '696969'
                  ],
                  pieHole: 0.4
                });
// [END earthengine__charts_image__regions_donut_chart]

// [START earthengine__charts_image__by_class_spectral_profile_chart]
// Import the example feature collection.
var ecoregions = ee.FeatureCollection('projects/google/charts_feature_example');

// Convert ecoregion feature collection to a classified image.
var regionsBand =
    ecoregions
        .reduceToImage({properties: ['value'], reducer: ee.Reducer.first()})
        .rename('class');

// Define a MODIS surface reflectance composite.
var modisSr = ee.ImageCollection('MODIS/006/MOD09A1')
                  .filter(ee.Filter.date('2018-06-01', '2018-09-01'))
                  .select('sur_refl_b0[0-7]')
                  .mean();

// Reorder reflectance bands by ascending wavelength and
// add the classified ecoregions image as a band to the SR collection and
var modisSrClass = modisSr.select([2, 3, 0, 1, 4, 5, 6]).addBands(regionsBand);

// Define a list of MODIS SR wavelengths for x-axis labels.
var wavelengths = [469, 555, 655, 858, 1240, 1640, 2130];

// Define the chart and print it to the console.
var chart = ui.Chart.image
                .byClass({
                  image: modisSrClass,
                  classBand: 'class',
                  region: ecoregions,
                  reducer: ee.Reducer.mean(),
                  scale: 500,
                  classLabels: ['Desert', 'Forest', 'Grassland'],
                  xLabels: wavelengths
                })
                .setChartType('ScatterChart')
                .setOptions({
                  title: 'Ecoregion Spectral Signatures',
                  hAxis: {
                    title: 'Wavelength (nm)',
                    titleTextStyle: {italic: false, bold: true},
                    viewWindow: {min: wavelengths[0], max: wavelengths[6]}
                  },
                  vAxis: {
                    title: 'Reflectance (x1e4)',
                    titleTextStyle: {italic: false, bold: true}
                  },
                  colors: ['f0af07', '0f8755', '76b349'],
                  pointSize: 0,
                  lineSize: 5,
                  curveType: 'function'
                });
print(chart);
// [END earthengine__charts_image__by_class_spectral_profile_chart]

// [START earthengine__charts_image__histogram_chart]
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
            title: 'Reflectance (x1e4)',
            titleTextStyle: {italic: false, bold: true},
          },
          vAxis:
              {title: 'Count', titleTextStyle: {italic: false, bold: true}},
          colors: ['cf513e', '1d6b99', 'f0af07']
        });
print(chart);
// [END earthengine__charts_image__histogram_chart]
