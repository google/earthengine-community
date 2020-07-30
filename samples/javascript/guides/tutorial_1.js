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
 * @fileoverview Earth Engine Developer's Guide examples from Tutorial 1 - API.
 */

// PAGE: Visualizing Images and Image Bands

var polygon = ee.Geometry.Polygon(
    [[
      [-113.34045185546876, 36.35712776832254],
      [-113.34045185546876, 36.30845019190198],
      [-113.25805439453126, 36.30845019190198],
      [-113.25805439453126, 36.35712776832254]
    ]],
    null, false);
var point = ee.Geometry.Point([-113.2937599609375, 36.30402344964642]);
var roi = polygon;

// [START earthengine__tutorial_1__hello_image]
// Instantiate an image with the Image constructor.
var image = ee.Image('CGIAR/SRTM90_V4');

// Zoom to a location.
Map.setCenter(-112.8598, 36.2841, 9); // Center on the Grand Canyon.

// Display the image on the map.
Map.addLayer(image);
// [END earthengine__tutorial_1__hello_image]

// [START earthengine__tutorial_1__print_image]
print('SRTM image', image);
// [END earthengine__tutorial_1__print_image]

// [START earthengine__tutorial_1__custom_vis]
Map.addLayer(image, {min: 0, max: 3000}, 'custom visualization');
// [END earthengine__tutorial_1__custom_vis]

// [START earthengine__tutorial_1__palette_vis]
Map.addLayer(image, {min: 0, max: 3000, palette: ['blue', 'green', 'red']},
    'custom palette');
// [END earthengine__tutorial_1__palette_vis]

// PAGE: Computations using Images

// [START earthengine__tutorial_1__terrain_algo]
// Load the SRTM image.
var srtm = ee.Image('CGIAR/SRTM90_V4');

// Apply an algorithm to an image.
var slope = ee.Terrain.slope(srtm);

// Display the result.
Map.setCenter(-112.8598, 36.2841, 9); // Center on the Grand Canyon.
Map.addLayer(slope, {min: 0, max :60}, 'slope');
// [END earthengine__tutorial_1__terrain_algo]

// [START earthengine__tutorial_1__image_math]
// Get the aspect (in degrees).
var aspect = ee.Terrain.aspect(srtm);

// Convert to radians, compute the sin of the aspect.
var sinImage = aspect.divide(180).multiply(Math.PI).sin();

// Display the result.
Map.addLayer(sinImage, {min: -1, max: 1}, 'sin');
// [END earthengine__tutorial_1__image_math]

// [START earthengine__tutorial_1__reduce_region]
// Compute the mean elevation in the polygon.
var meanDict = srtm.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: polygon,
  scale: 90
});

// Get the mean from the dictionary and print it.
var mean = meanDict.get('elevation');
print('Mean elevation', mean);
// [END earthengine__tutorial_1__reduce_region]

// [START earthengine__tutorial_1__scale]
var scale = srtm.projection().nominalScale();
print('SRTM scale in meters', scale);
// [END earthengine__tutorial_1__scale]

// PAGE: Image Collections

// [START earthengine__tutorial_1__collection_load]
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');
// [END earthengine__tutorial_1__collection_load]

// [START earthengine__tutorial_1__filtering]
var spatialFiltered = l8.filterBounds(point);
print('spatialFiltered', spatialFiltered);

var temporalFiltered = spatialFiltered.filterDate('2015-01-01', '2015-12-31');
print('temporalFiltered', temporalFiltered);
// [END earthengine__tutorial_1__filtering]

// [START earthengine__tutorial_1__sorting]
// This will sort from least to most cloudy.
var sorted = temporalFiltered.sort('CLOUD_COVER');

// Get the first (least cloudy) image.
var scene = sorted.first();
// [END earthengine__tutorial_1__sorting]

// [START earthengine__tutorial_1__default_rgb]
Map.centerObject(scene, 9);
Map.addLayer(scene, {}, 'default RGB');
// [END earthengine__tutorial_1__default_rgb]

// [START earthengine__tutorial_1__true_color]
var visParams = {bands: ['B4', 'B3', 'B2'], max: 0.3};
Map.addLayer(scene, visParams, 'true-color composite');
// [END earthengine__tutorial_1__true_color]

// [START earthengine__tutorial_1__collection_mosaic]
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');
var landsat2016 = l8.filterDate('2016-01-01', '2016-12-31');
Map.addLayer(landsat2016, visParams, 'l8 collection');
// [END earthengine__tutorial_1__collection_mosaic]

// PAGE: Compositing, Mosaicking, and Masking and Clipping

// [START earthengine__tutorial_1__median_composite]
// Get the median over time, in each band, in each pixel.
var median = l8.filterDate('2016-01-01', '2016-12-31').median();

// Make a handy variable of visualization parameters.
var visParams = {bands: ['B4', 'B3', 'B2'], max: 0.3};

// Display the median composite.
Map.addLayer(median, visParams, 'median');
// [END earthengine__tutorial_1__median_composite]

// [START earthengine__tutorial_1__masking]
// Load or import the Hansen et al. forest change dataset.
var hansenImage = ee.Image('UMD/hansen/global_forest_change_2015');

// Select the land/water mask.
var datamask = hansenImage.select('datamask');

// Create a binary mask.
var mask = datamask.eq(1);

// Update the composite mask with the water mask.
var maskedComposite = median.updateMask(mask);
Map.addLayer(maskedComposite, visParams, 'masked');
// [END earthengine__tutorial_1__masking]

// [START earthengine__tutorial_1__mosaicking]
// Make a water image out of the mask.
var water = mask.not();

// Mask water with itself to mask all the zeros (non-water).
water = water.mask(water);

// Make an image collection of visualization images.
var mosaic = ee.ImageCollection([
  median.visualize(visParams),
  water.visualize({palette: '000044'}),
]).mosaic();

// Display the mosaic.
Map.addLayer(mosaic, {}, 'custom mosaic');
// [END earthengine__tutorial_1__mosaicking]

// PAGE: Mapping a function over a collection

// [START earthengine__tutorial_1__single_image]
// Define a point of interest. Use the UI Drawing Tools to import a point
// geometry and name it "point" or set the point coordinates with the
// ee.Geometry.Point() function as demonstrated here.
var point = ee.Geometry.Point([-122.292, 37.9018]);

// Import the Landsat 8 TOA image collection.
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');

// Get the least cloudy image in 2015.
var image = ee.Image(
  l8.filterBounds(point)
    .filterDate('2015-01-01', '2015-12-31')
    .sort('CLOUD_COVER')
    .first()
);
// [END earthengine__tutorial_1__single_image]

// [START earthengine__tutorial_1__ndvi_hard_way]
// Compute the Normalized Difference Vegetation Index (NDVI).
var nir = image.select('B5');
var red = image.select('B4');
var ndvi = nir.subtract(red).divide(nir.add(red)).rename('NDVI');

// Display the result.
Map.centerObject(image, 9);
var ndviParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};
Map.addLayer(ndvi, ndviParams, 'NDVI image');
// [END earthengine__tutorial_1__ndvi_hard_way]

// [START earthengine__tutorial_1__ndvi_easy_way]
var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
// [END earthengine__tutorial_1__ndvi_easy_way]
Map.addLayer(ndvi, ndviParams, 'NDVI image 2');

// [START earthengine__tutorial_1__ndvi_function]
var addNDVI = function(image) {
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
};

// Test the addNDVI function on a single image.
var ndvi = addNDVI(image).select('NDVI');
// [END earthengine__tutorial_1__ndvi_function]
Map.addLayer(ndvi, ndviParams, 'NDVI image 3');

// [START earthengine__tutorial_1__map_function]
var withNDVI = l8.map(addNDVI);
// [END earthengine__tutorial_1__map_function]

// [START earthengine__tutorial_1__greenest]
// Make a "greenest" pixel composite.
var greenest = withNDVI.qualityMosaic('NDVI');

// Display the result.
var visParams = {bands: ['B4', 'B3', 'B2'], max: 0.3};
Map.addLayer(greenest, visParams, 'Greenest pixel composite');
// [END earthengine__tutorial_1__greenest]

// PAGE: Exporting Charts and Images

// [START earthengine__tutorial_1__ndvi_series]
// Import the Landsat 8 TOA image collection.
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');

// Map a function over the Landsat 8 TOA collection to add an NDVI band.
var withNDVI = l8.map(function(image) {
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
});
// [END earthengine__tutorial_1__ndvi_series]

// [START earthengine__tutorial_1__chart]
// Create a chart.
var chart = ui.Chart.image.series({
  imageCollection: withNDVI.select('NDVI'),
  region: roi,
  reducer: ee.Reducer.first(),
  scale: 30
}).setOptions({title: 'NDVI over time'});

// Display the chart in the console.
print(chart);
// [END earthengine__tutorial_1__chart]

// [START earthengine__tutorial_1__cloudless_series]
var cloudlessNDVI = l8.map(function(image) {
  // Get a cloud score in [0, 100].
  var cloud = ee.Algorithms.Landsat.simpleCloudScore(image).select('cloud');

  // Create a mask of cloudy pixels from an arbitrary threshold.
  var mask = cloud.lte(20);

  // Compute NDVI.
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');

  // Return the masked image with an NDVI band.
  return image.addBands(ndvi).updateMask(mask);
});

print(ui.Chart.image.series({
  imageCollection: cloudlessNDVI.select('NDVI'),
  region: roi,
  reducer: ee.Reducer.first(),
  scale: 30
}).setOptions({title: 'Cloud-masked NDVI over time'}));
// [END earthengine__tutorial_1__cloudless_series]

// [START earthengine__tutorial_1__greenest_composite]
var greenest = cloudlessNDVI.qualityMosaic('NDVI');
// [END earthengine__tutorial_1__greenest_composite]

// [START earthengine__tutorial_1__exporting]
// Create a 3-band, 8-bit, color-IR composite to export.
var visualization = greenest.visualize({
  bands: ['B5', 'B4', 'B3'],
  max: 0.4
});

// Create a task that you can launch from the Tasks tab.
Export.image.toDrive({
  image: visualization,
  description: 'Greenest_pixel_composite',
  scale: 30
});
// [END earthengine__tutorial_1__exporting]

