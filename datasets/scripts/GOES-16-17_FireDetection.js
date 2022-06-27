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
                      .filterDate('2020-07-15','2020-07-16');
var image = collection.first();

Map.setOptions("HYBRID");

// Select property of image.
var DQF = image.select('DQF');

// Define United States region and center map.
var USgeometry = ee.Geometry.Rectangle({coords: [-127, 24, -64, 50], geodesic: false});
Map.centerObject(USgeometry, 5);

// Create color palette to correspond with Data Quality Flag categories.
var DQFVisParam = {
  min: 0,
  max: 5,
  palette: [
    'FFFF00',    // 0:  Good quality fire pixel
    '8BC34A',    // 1:  Good quality fire-free pixel
    'B3E5FC',    // 2:  Invalid pixel due to opaque cloud
    '2196F3',    // 3:  Invalid pixel due to to surface type, sunglint,
                 //     LZA threshold exceeded, off earth, or missing input data
    'B2EBF2',    // 4:  Invalid pixel due to bad input data
    'C5CAE9',    // 5:  Invalid pixel due to algorithm failure
  ]
 };

// Filter image to show only good quality fire-pixels (DQF = 0).
var onlyFire = DQF.eq(0);

// Buffer fires to make them stand out.
var fireBuffer = onlyFire.reduceToVectors({
  scale: 2000,
  geometryType: 'centroid',
  labelProperty: 'buffer',
  maxPixels: 1e10,})
  .map(function(feature){
  return feature.buffer(50000);});

// Add Layers to Map.
Map.addLayer(DQF, DQFVisParam, 'Fire Data Quality Flags', true, 0.7);
Map.addLayer(fireBuffer, {color: 'red'}, 'Buffer', true);
