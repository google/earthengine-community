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

// [START earthengine__apidocs__ee_imagecollection_min]
// Sentinel-2 image collection for July 2021 intersecting a point of interest.
// Reflectance, cloud probability, and scene classification bands are selected.
var col = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterDate('2021-07-01', '2021-08-01')
  .filterBounds(ee.Geometry.Point(-122.373, 37.448))
  .select('B.*|MSK_CLDPRB|SCL');

// Visualization parameters for reflectance RGB.
var visRefl = {
  bands: ['B11', 'B8', 'B3'],
  min: 0,
  max: 4000
};
Map.setCenter(-122.373, 37.448, 9);
Map.addLayer(col, visRefl, 'Collection reference', false);

// Reduce the collection to a single image using a variety of methods.
var mean = col.mean();
Map.addLayer(mean, visRefl, 'Mean (B11, B8, B3)');

var median = col.median();
Map.addLayer(median, visRefl, 'Median (B11, B8, B3)');

var min = col.min();
Map.addLayer(min, visRefl, 'Min (B11, B8, B3)');

var max = col.max();
Map.addLayer(max, visRefl, 'Max (B11, B8, B3)');

var sum = col.sum();
Map.addLayer(sum,
  {bands: ['MSK_CLDPRB'], min: 0, max: 500}, 'Sum (MSK_CLDPRB)');

var product = col.product();
Map.addLayer(product,
  {bands: ['MSK_CLDPRB'], min: 0, max: 1e10}, 'Product (MSK_CLDPRB)');

// ee.ImageCollection.mode returns the most common value. If multiple mode
// values occur, the minimum mode value is returned.
var mode = col.mode();
Map.addLayer(mode, {bands: ['SCL'], min: 1, max: 11}, 'Mode (pixel class)');

// ee.ImageCollection.count returns the frequency of valid observations. Here,
// image pixels are masked based on cloud probability to add valid observation
// variability to the collection. Note that pixels with no valid observations
// are masked out of the returned image.
var notCloudCol = col.map(function(img) {
  return img.updateMask(img.select('MSK_CLDPRB').lte(10));
});
var count = notCloudCol.count();
Map.addLayer(count, {min: 1, max: 5}, 'Count (not cloud observations)');

// ee.ImageCollection.mosaic composites images according to their position in
// the collection (priority is last to first) and pixel mask status, where
// invalid (mask value 0) pixels are filled by preceding valid (mask value >0)
// pixels.
var mosaic = notCloudCol.mosaic();
Map.addLayer(mosaic, visRefl, 'Mosaic (B11, B8, B3)');
// [END earthengine__apidocs__ee_imagecollection_min]
