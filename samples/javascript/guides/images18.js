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
 *   from 'Images - Object-based methods' page
 */

// [START earthengine__images18__example_setup]
// Make an area of interest geometry centered on San Francisco.
var point = ee.Geometry.Point(-122.1899, 37.5010);
var aoi = point.buffer(10000);

// Import a Landsat 8 image, subset the thermal band, and clip to the
// area of interest.
var kelvin = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')
  .select(['B10'], ['kelvin'])
  .clip(aoi);

// Display the thermal band.
Map.centerObject(point, 13);
Map.addLayer(kelvin, {min: 288, max: 305}, 'Kelvin');

// Threshold the thermal band to set hot pixels as value 1, mask all else.
var hotspots = kelvin.gt(303)
  .selfMask()
  .rename('hotspots');

// Display the thermal hotspots on the Map.
Map.addLayer(hotspots, {palette: 'FF0000'}, 'Hotspots');
// [END earthengine__images18__example_setup]

// [START earthengine__images18__label_objects]
// Uniquely label the hotspot image objects.
var objectId = hotspots.connectedComponents({
  connectedness: ee.Kernel.plus(1),
  maxSize: 128
});

// Display the uniquely ID'ed objects to the Map.
Map.addLayer(objectId.randomVisualizer(), null, 'Objects');
// [END earthengine__images18__label_objects]

// [START earthengine__images18__object_size]
// Compute the number of pixels in each object defined by the "labels" band.
var objectSize = objectId.select('labels')
  .connectedPixelCount({
    maxSize: 128, eightConnected: false
  });

// Display object pixel count to the Map.
Map.addLayer(objectSize, null, 'Object n pixels');
// [END earthengine__images18__object_size]

// [START earthengine__images18__object_area]
// Get a pixel area image.
var pixelArea = ee.Image.pixelArea();

// Multiply pixel area by the number of pixels in an object to calculate
// the object area. The result is an image where each pixel
// of an object relates the area of the object in m^2.
var objectArea = objectSize.multiply(pixelArea);

// Display object area to the Map.
Map.addLayer(objectArea,
             {min: 0, max: 30000, palette: ['0000FF', 'FF00FF']},
             'Object area m^2');
// [END earthengine__images18__object_area]

// [START earthengine__images18__area_mask]
// Threshold the `objectArea` image to define a mask that will mask out
// objects below a given size (1 hectare in this case).
var areaMask = objectArea.gte(10000);

// Update the mask of the `objectId` layer defined previously using the
// minimum area mask just defined.
objectId = objectId.updateMask(areaMask);
Map.addLayer(objectId, null, 'Large hotspots');
// [END earthengine__images18__area_mask]

// [START earthengine__images18__reduce_objects]
// Make a suitable image for `reduceConnectedComponents()` by adding a label
// band to the `kelvin` temperature image.
kelvin = kelvin.addBands(objectId.select('labels'));

// Calculate the mean temperature per object defined by the previously added
// "labels" band.
var patchTemp = kelvin.reduceConnectedComponents({
  reducer: ee.Reducer.mean(),
  labelBand: 'labels'
});

// Display object mean temperature to the Map.
Map.addLayer(
  patchTemp,
  {min: 303, max: 304, palette: ['yellow', 'red']},
  'Mean temperature'
);
// [END earthengine__images18__reduce_objects]
