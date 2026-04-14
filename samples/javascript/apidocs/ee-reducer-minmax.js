/**
 * Copyright 2026 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_reducer_minmax]
// The ee.Reducer.minMax() function calculates the minimum and maximum values
// for its input data. It is a versatile reducer that can be applied
// to various Earth Engine object classes, as demonstrated in the following
// examples.
//
// 1. Lists (list reduction)
// Find the min and max values in an ee.List.
var list = ee.List([1, 2, 3, 4]);
var minMaxList = list.reduce(ee.Reducer.minMax());
print('ee.List min and max:', minMaxList);  // { "max": 4, "min": 1 }

// 2. Arrays (array reduction)
// Find the min and max values in an ee.Array.
var array = ee.Array([[1], [2], [3], [4]]);
var minMaxArray = array.reduce(ee.Reducer.minMax(), [0], 1);
print('ee.Array min and max:', minMaxArray);  // [[1, 4]]

// 3. Collections (metadata reduction)
// Find the min and max values of a collection property.
var dataset = ee.ImageCollection('NOAA/GOES/19/MCMIPF').limit(1000);

var range = dataset.reduceColumns(ee.Reducer.minMax(), ['system:time_start']);
print(
    'ee.ImageCollection property (system:time_start) min and max:',
    ee.Date(range.get('min')),  // Date (2024-10-10 20:40:20)
    ee.Date(range.get('max'))   // Date (2024-10-17 19:20:20)
);

// 4. Images (spatial reduction)
// Find the min and max pixel values within an image region.
var image = ee.Image('MODIS/061/MOD13A2/2021_01_01').select('NDVI');
var region = ee.Geometry.Point([-122.443, 37.753]).buffer(10000).bounds();

var pixelStats = image.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: region,
  scale: 1000,
});
print('ee.Image pixel min and max in region:', pixelStats);

// 5. Images (neighborhood reduction)
// Find the min and max values in the local neighborhood of each pixel.
var localMinMax = image.reduceNeighborhood({
  reducer: ee.Reducer.minMax(),
  kernel: ee.Kernel.square(3),
});
print('ee.Image neighborhood min and max bands:', localMinMax.bandNames());
Map.setCenter(-122.443, 37.753, 9);
Map.addLayer(
    localMinMax, {bands: ['NDVI_min'], min: 0, max: 9000}, 'Local Min NDVI');
Map.addLayer(
    localMinMax, {bands: ['NDVI_max'], min: 0, max: 9000}, 'Local Max NDVI');

// 6. FeatureCollections (zonal reduction)
// Find the min and max pixel values for multiple features.
var points = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-122.443, 37.753]), {label: 'Point 1'}),
  ee.Feature(ee.Geometry.Point([-122.158, 37.559]), {label: 'Point 2'})
]);

var zonalStats = image.reduceRegions({
  collection: points.map(function(f) {
    return f.buffer(5000);
  }),
  reducer: ee.Reducer.minMax(),
  scale: 1000
});
print('ee.FeatureCollection zonal min and max:', zonalStats);

// 7. ImageCollections (temporal reduction)
// Find the min and max pixel values across an ImageCollection.
var col = ee.ImageCollection('MODIS/061/MOD13A2')
              .filterDate('2021-01-01', '2022-01-01')
              .select('NDVI');

var colMinMax = col.reduce(ee.Reducer.minMax());
print(
    'ee.ImageCollection pixel-wise min and max bands:', colMinMax.bandNames());
Map.addLayer(
    colMinMax, {bands: ['NDVI_min'], min: 0, max: 9000}, 'Temporal Min NDVI');
Map.addLayer(
    colMinMax, {bands: ['NDVI_max'], min: 0, max: 9000}, 'Temporal Max NDVI');
// [END earthengine__apidocs__ee_reducer_minmax]
