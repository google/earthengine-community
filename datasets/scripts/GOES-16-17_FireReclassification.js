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

// Load GOES-16 Image Collection, filter date and select first image.
var collection = ee.ImageCollection('NOAA/GOES/16/FDCC')
                     .filterDate('2020-07-15', '2020-07-16');
var image = collection.first();

Map.setOptions('HYBRID');

// Select property of image.
var mask = image.select('Mask');
var power = image.select('Power');

// Define United States region and center map.
var USgeometry =
    ee.Geometry.Rectangle({coords: [-127, 24, -64, 50], geodesic: false});
Map.centerObject(USgeometry, 5);

// Filter to show only pixels that signify a high liklihood of fire
var allFire = mask.remap(
    [10, 11, 12, 13, 14, 30, 31, 32, 33, 34],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
var onlyFire = allFire.eq(1);

// Buffer fires to make them stand out.
var fireBuffer = onlyFire
                     .reduceToVectors({
                       scale: 2000,
                       geometryType: 'centroid',
                       labelProperty: 'buffer',
                       maxPixels: 1e10,
                     })
                     .map(function(feature) {
                       return feature.buffer(50000);
                     });

// Remap Mask flags into fire categories.
var classifiedImage = mask.remap(
    [
      0,   10,  11,  12,  13,  14,  15,  30,  31,  32,  33,  34,
      35,  40,  50,  60,  100, 120, 121, 123, 124, 125, 126, 127,
      150, 151, 152, 153, 170, 180, 182, 185, 186, 187, 188, 200,
      201, 205, 210, 215, 220, 225, 230, 240, 245
    ],
    [
      7,  1,  2,  3,  4,  5,  6,  1,  2,  3,  4,  5,  6,  7,  7,
      7,  0,  7,  7,  8,  8,  8,  8,  8,  9,  9,  9,  9,  10, 10,
      10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11
    ]);

// Create color palette to correspond with fire categories.
var maskVisParam = {
  min: 0,
  max: 11,
  palette: [
    '8BC34A',  // 0: Good quality fire-free pixel
    'FF5722',  // 1: Good quality fire pixel
    'FF1493',  // 2: Saturated fire pixel
    '9C27B0',  // 3: Cloud contaminated fire pixel
    'FF9800',  // 4: High probability fire pixel
    'FFC107',  // 5: Medium probability fire pixel
    'FFEB3B',  // 6:Low probability fire pixel
    'F5DEB3',  // 7: Invalid pixel due to sunglint, LZA threshold exceeded,
               //    off earth, missing input data, or unprocessed
    'A9A9A9',  // 8: Invalid pixel due to bad input data
    '2196F3',  // 9: Invalid pixel due to to surface type (water or desert)
    'C5CAE9',  // 10: Invalid pixel due to algorithm failure
    'B3E5FC',  // 11: Invalid pixel due to opaque cloud
  ]
};

// Create color palette to convey fire radiative power (intensity in megawatts).
var powerVisParam = {min: 0, max: 1500, palette: ['yellow', 'orange', 'red']};

// Add Layers to Map
Map.addLayer(classifiedImage, maskVisParam, 'Fire Mask', true, 0.7);
Map.addLayer(power, powerVisParam, 'FRP', true);
Map.addLayer(fireBuffer, {color: 'FF00FF'}, 'Buffer', true);
