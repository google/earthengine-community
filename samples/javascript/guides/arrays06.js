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
 *   from 'Arrays - Sorting and Reducing' section
 */

// [START earthengine__arrays06__sort_reduce]
// Define a function that scales and masks Landsat 8 surface reflectance images
// and adds an NDVI band.
function prepSrL8(image) {
  // Develop masks for unwanted pixels (fill, cloud, cloud shadow).
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);

  // Apply the scaling factors to the appropriate bands.
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);

  // Calculate NDVI.
  var ndvi = opticalBands.normalizedDifference(['SR_B5', 'SR_B4'])
      .rename('NDVI');

  // Replace original bands with scaled bands, add NDVI band, and apply masks.
  return image.addBands(opticalBands, null, true)
      .addBands(thermalBands, null, true)
      .addBands(ndvi)
      .updateMask(qaMask)
      .updateMask(saturationMask);
}

// Define an arbitrary region of interest as a point.
var roi = ee.Geometry.Point(-122.26032, 37.87187);

// Load a Landsat 8 surface reflectance collection.
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  // Filter to get only imagery at a point of interest.
  .filterBounds(roi)
  // Filter to get only six months of data.
  .filterDate('2021-01-01', '2021-07-01')
  // Prepare images by mapping the prepSrL8 function over the collection.
  .map(prepSrL8)
  // Select the bands of interest to avoid taking up unneeded memory.
  .select('SR_B.|NDVI');

// Convert the collection to an array.
var array = collection.toArray();

// Label of the axes.
var imageAxis = 0;
var bandAxis = 1;

// Get the NDVI slice and the bands of interest.
var bandNames = collection.first().bandNames();
var bands = array.arraySlice(bandAxis, 0, bandNames.length());
var ndvi = array.arraySlice(bandAxis, -1);

// Sort by descending NDVI.
var sorted = bands.arraySort(ndvi.multiply(-1));

// Get the highest 20% NDVI observations per pixel.
var numImages = sorted.arrayLength(imageAxis).multiply(0.2).int();
var highestNdvi = sorted.arraySlice(imageAxis, 0, numImages);

// Get the mean of the highest 20% NDVI observations by reducing
// along the image axis.
var mean = highestNdvi.arrayReduce({
  reducer: ee.Reducer.mean(),
  axes: [imageAxis]
});

// Turn the reduced array image into a multi-band image for display.
var meanImage = mean.arrayProject([bandAxis]).arrayFlatten([bandNames]);
Map.centerObject(roi, 12);
Map.addLayer(meanImage, {bands: ['SR_B6', 'SR_B5', 'SR_B4'], min: 0, max: 0.4});
// [END earthengine__arrays06__sort_reduce]
