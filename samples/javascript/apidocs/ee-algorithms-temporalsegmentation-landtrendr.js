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

// [START earthengine__apidocs__ee_algorithms_temporalsegmentation_landtrendr]
// A MODIS collection filtered by year and month, non-QA bands selected.
var col = ee.ImageCollection('MODIS/061/MOD13Q1')
  .filterDate('2000', '2021')
  .filter(ee.Filter.calendarRange(7, 8, 'month'))
  .select('NDVI|EVI|sur_refl.*');

// Add year property to all images in the collection.
col = col.map(function(img) {
  return img.set('year', img.date().get('year'));
});

// Join all images from the same year into lists.
var distinctCol = col.distinct(['year']);
var joinFilter = ee.Filter.equals({leftField: 'year', rightField: 'year'});
var joinCol = ee.Join.saveAll('same_year').apply(distinctCol, col, joinFilter);

// Composite the images from each unique year by median.
var annualCol = joinCol.map(function(img) {
  img = ee.Image(img);
  // Calculate median per-pixel annual July-August composite.
  var median = ee.ImageCollection.fromImages(img.get('same_year')).median();
  // Construct an image for LandTrendr to base segmentation on. The algorithm
  // expects that vegetation loss for a given spectral index is a positive
  // delta, so here we invert the EVI band.
  var segBand = median.select(['EVI']).multiply(-1).rename('EVI_lt_seg');
  // LandTrendr uses the first band of an image for segmentation and then
  // applies vertex-anchored interpolation to subsequent bands' time series, so
  // here we prepend the constructed segmentation band to the original median
  // image composite. 
  var ltImage = segBand.addBands(median);
  // Transfer date metadata to the new image.
  var year = img.getNumber('year');
  var millis = ee.Date.fromYMD(year, 8, 1).millis();  // Unix timestamp required
  return ltImage.set({'year': year, 'system:time_start': millis});
});

// Set LandTrendr segmentation parameters. Note that the timeSeries argument
// is the annual composite from above.
var ltParams = {
  timeSeries: ee.ImageCollection(annualCol),
  maxSegments: 7,
  spikeThreshold: 0.9,
  vertexCountOvershoot: 3,
  preventOneYearRecovery: false,
  recoveryThreshold: 0.25,
  pvalThreshold: 0.1,
  bestModelProportion: 0.75,
  minObservationsNeeded: 6
};

// Run the LandTrendr algorithm.
var lt = ee.Algorithms.TemporalSegmentation.LandTrendr(ltParams);
print('LandTrendr results structure', lt);

// Subset the segmentation components.
var ltArray = lt.select('LandTrendr');

// Display segmentation components on the map (use Inspector tool to explore). 
var aoi = ee.Geometry.BBox(-124.67, 41.89, -121.10, 46.29);
Map.setCenter(-122.67, 44.12, 7);
Map.addLayer(ltArray.clip(aoi), null, 'Segmentation (Use Inspector)', false);

// Subset an example fit-to-vertices (FTV) index array, EVI here.
var eviFtvArray = lt.select('EVI_fit');

// Convert the image array to an image with bands labeled by year.
var years = distinctCol.aggregate_array('year').sort().map(function(i) {
  return ee.Number(i).format();
});
var eviFtvImg = eviFtvArray.arrayFlatten([years]);

// Display the FTV image to the map using write function memory insertion
// to highlight change between three time slices. Colored pixels indicate
// change, grey scale indicates no change.
Map.addLayer(
  eviFtvImg.clip(aoi),
  {bands: ['2000', '2010', '2020'], min: 1400, max: 5800},
  'FTV EVI change');
  
// For more information on working with LandTrendr outputs, please see:
// https://emapr.github.io/LT-GEE/working-with-outputs.html
// [END earthengine__apidocs__ee_algorithms_temporalsegmentation_landtrendr]
