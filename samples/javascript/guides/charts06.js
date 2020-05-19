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
 *     from 'DOY series' section
 */

// [START earthengine__charts06__doy_series]
// Define a FeatureCollection: three regions of the American West.
var city = ee.Feature(    // San Francisco.
    ee.Geometry.Rectangle(-122.42, 37.78, -122.4, 37.8), {label: 'City'});
var forest = ee.Feature(  // Tahoe National Forest.
    ee.Geometry.Rectangle(-121, 39.4, -120.99, 39.45), {label: 'Forest'});
var desert = ee.Feature(  // Black Rock Desert.
    ee.Geometry.Rectangle(-119.02, 40.95, -119, 41), {label: 'Desert'});

var regions = new ee.FeatureCollection([city, forest, desert]);

// Load several years of MODIS NDVI data.
var collection = ee.ImageCollection('MODIS/MCD43A4_006_NDVI')
    .filterDate(ee.Date('2011-01-01'), ee.Date('2014-12-31'));

// Define a chart with one series in the forest region, averaged by DOY.
var series1 = ui.Chart.image.doySeries(
    collection, forest, ee.Reducer.mean(), 500);

// Define a chart with a a different series for each year in the forest region.
var series2 = ui.Chart.image.doySeriesByYear(
    collection, 'NDVI', forest, ee.Reducer.mean(), 500);

// Define a chart with different series for each region, averaged by DOY.
var series3 = ui.Chart.image.doySeriesByRegion(
    collection, 'NDVI', regions, ee.Reducer.mean(), 500, ee.Reducer.mean(), 'label');

// Display the three charts.
print(series1, series2, series3);
// [END earthengine__charts06__doy_series]
