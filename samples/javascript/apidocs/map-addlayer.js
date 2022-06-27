/**
 * Copyright 2021 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__map_addlayer]
// A Sentinel-2 surface reflectance image.
var image = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG');
Map.setCenter(-121.87, 37.44, 9);

// Set multi-band RGB image visualization parameters. If the "bands" parameter
// is not defined, the first three bands are used.
var rgbVis = {
  bands: ['B11', 'B8', 'B3'],
  min: 0,
  max: 3000
};
Map.addLayer(image, rgbVis, 'Multi-band RGB image');

// Set band-specific "min" and "max" properties.
var rgbVisBandSpec = {
  bands: ['B11', 'B8', 'B3'],
  min: [0, 75, 150],
  max: [3500, 3000, 2500]
};
Map.addLayer(image, rgbVisBandSpec, 'Band-specific min/max');

// If you don't specify "min" and "max" properties, they will be determined
// from the data type range, often resulting in an ineffective color stretch.
Map.addLayer(image.select('B8'), null, 'Default visParams');

// If an image layer has already been styled, set "visParams" as null.
var imageRgb = image.visualize(rgbVis);
Map.addLayer(imageRgb, null, 'Pre-styled image');

// Use the "palette" parameter with single-band image inputs to define the
// linear color gradient to stretch between the "min" and "max" values.
var singleBandVis = {
  min: 0,
  max: 3000,
  palette: ['blue', 'yellow', 'green']
};
Map.addLayer(image.select('B8'), singleBandVis, 'Single-band palette');

// Images within ImageCollections are automatically mosaicked according to mask
// status and image order. The last image in the collection takes priority,
// invalid pixels are filled by valid pixels in preceding images.
var imageCol = ee.ImageCollection('COPERNICUS/S2_SR')
                   .filterDate('2021-03-01', '2021-04-01');
Map.addLayer(imageCol, rgbVis, 'ImageCollection mosaic');

// FeatureCollection, Feature, and Geometry objects can be styled using the
// "color" parameter.
var featureCol = ee.FeatureCollection('WCMC/WDPA/current/polygons');
Map.addLayer(featureCol, {color: 'purple'}, 'FeatureCollection');
// [END earthengine__apidocs__map_addlayer]
