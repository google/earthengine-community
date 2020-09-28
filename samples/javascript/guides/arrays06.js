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
// Define an arbitrary region of interest as a point.
var roi = ee.Geometry.Point(-122.26032, 37.87187);

// Use these bands.
var bandNames = ee.List(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'B11']);

// Load a Landsat 8 collection.
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
  // Select the bands of interest to avoid taking up memory.
  .select(bandNames)
  // Filter to get only imagery at a point of interest.
  .filterBounds(roi)
  // Filter to get only six months of data.
  .filterDate('2014-06-01', '2014-12-31')
  // Mask clouds by mapping the cloudMask function over the collection.
  // This will add a cloud score band called 'cloud' to every image.
  .map(function(image) {
    return ee.Algorithms.Landsat.simpleCloudScore(image);
});

// Convert the collection to an array.
var array = collection.toArray();

// Label of the axes.
var imageAxis = 0;
var bandAxis = 1;

// Get the cloud slice and the bands of interest.
var bands = array.arraySlice(bandAxis, 0, bandNames.length());
var clouds = array.arraySlice(bandAxis, bandNames.length());

// Sort by cloudiness.
var sorted = bands.arraySort(clouds);

// Get the least cloudy images, 20% of the total.
var numImages = sorted.arrayLength(imageAxis).multiply(0.2).int();
var leastCloudy = sorted.arraySlice(imageAxis, 0, numImages);

// Get the mean of the least cloudy images by reducing along the image axis.
var mean = leastCloudy.arrayReduce({
  reducer: ee.Reducer.mean(),
  axes: [imageAxis]
});

// Turn the reduced array image into a multi-band image for display.
var meanImage = mean.arrayProject([bandAxis]).arrayFlatten([bandNames]);
Map.centerObject(roi, 12);
Map.addLayer(meanImage, {bands: ['B5', 'B4', 'B2'], min: 0, max: 0.5});
// [END earthengine__arrays06__sort_reduce]
