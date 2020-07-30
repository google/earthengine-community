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
 *   from 'Masking' section
 */

// [START earthengine__gettingStarted11__cloud_masking]
// This function gets NDVI from a Landsat 8 image.
var addNDVI = function(image) {
  return image.addBands(image.normalizedDifference(['B5', 'B4']));
};

// This function masks cloudy pixels.
var cloudMask = function(image) {
  var clouds = ee.Algorithms.Landsat.simpleCloudScore(image).select(['cloud']);
  return image.updateMask(clouds.lt(10));
};

// Load a Landsat collection, map the NDVI and cloud masking functions over it.
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
  .filterBounds(ee.Geometry.Point([-122.262, 37.8719]))
  .filterDate('2014-03-01', '2014-05-31')
  .map(addNDVI)
  .map(cloudMask);

// Reduce the collection to the mean of each pixel and display.
var meanImage = collection.reduce(ee.Reducer.mean());
var vizParams = {bands: ['B5_mean', 'B4_mean', 'B3_mean'], min: 0, max: 0.5};
Map.addLayer(meanImage, vizParams, 'mean');

// Load a region in which to compute the mean and display it.
var counties = ee.FeatureCollection('TIGER/2016/Counties');
var santaClara = ee.Feature(counties.filter(ee.Filter.eq('NAME', 'Santa Clara')).first());
Map.addLayer(santaClara);

// Get the mean of NDVI in the region.
var mean = meanImage.select(['nd_mean']).reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: santaClara.geometry(),
  scale: 30
});

// Print mean NDVI for the region.
mean.get('nd_mean').evaluate(function(val){
  print('Santa Clara spring mean NDVI:', val);
});
// [END earthengine__gettingStarted11__cloud_masking]
