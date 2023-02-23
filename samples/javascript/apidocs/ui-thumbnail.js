/**
 * Copyright 2023 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ui_thumbnail]
// The goal is to create a series of thumbnail images for an elevation dataset
// with different backgrounds. The background layers and image visualization
// are previewed in the Code Editor map before creating the thumbnails.

// Define a black background.
var blackBg = ee.Image.rgb(0, 0, 0)
  .visualize({min: 0, max: 255});
Map.addLayer(blackBg, {}, 'Black background');

// Define a water / land background.
var waterLandBg = ee.Image('NOAA/NGDC/ETOPO1').select('bedrock').gt(0.0)
  .visualize({palette: ['cadetblue', 'lightgray']});
Map.addLayer(waterLandBg, {}, 'Water / land background');

// A map display of a digital elevation model (DEM).
var image = ee.Image('AU/GA/DEM_1SEC/v10/DEM-S').select('elevation')
  .visualize({
     min: -10.0,
     max: 1300.0,
     palette: [
       '3ae237', 'b5e22e', 'd6e21f', 'fff705', 'ffd611', 'ffb613', 'ff8b13',
       'ff6e08', 'ff500d', 'ff0000', 'de0101', 'c21301', '0602ff', '235cb1',
       '307ef3', '269db1', '30c8e2', '32d3ef', '3be285', '3ff38f', '86e26f'
     ],
  });
Map.addLayer(image, {}, 'Elevation');

// Set the center of the map.
var lon = 133.95;
var lat = -24.69;
Map.setCenter(lon, lat, 4);

// Set the basic parameters for the thumbnail.
// Half-width of the thumbnail in degrees in EPSG:3857.
var delta = 22;
// Width and Height of the Thumbail image.
var pixels = 256;

var areaOfInterest = ee.Geometry.Rectangle(
  [lon - delta, lat - delta, lon + delta, lat + delta], null, false);

var parameters = {
  dimensions: [pixels, pixels],
  region: areaOfInterest,
  crs: 'EPSG:3857',
  format: 'png'};

// Create a thumbnail with no background fill.
// Masked pixels will be transparent.
print(ui.Thumbnail({image: image, params: parameters}));

// Use a black background to replace masked image pixels.
var imageWithBlackBg = blackBg.blend(image);
print(ui.Thumbnail({
  image: imageWithBlackBg, params: parameters}));

// Use the water / land background to replace masked image pixels.
var imageWithWaterLandBg = waterLandBg.blend(image);
print(ui.Thumbnail({
  image: imageWithWaterLandBg, params: parameters}));
// [END earthengine__apidocs__ui_thumbnail]
