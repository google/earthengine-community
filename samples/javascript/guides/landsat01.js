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
 *   from 'Landsat Algorithms - Radiance and Reflectance' section
 */

// [START earthengine__landsat01__radiance_toa]
// Load a raw Landsat scene and display it.
var raw = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318');
Map.centerObject(raw, 10);
Map.addLayer(raw, {bands: ['B4', 'B3', 'B2'], min: 6000, max: 12000}, 'raw');

// Convert the raw data to radiance.
var radiance = ee.Algorithms.Landsat.calibratedRadiance(raw);
Map.addLayer(radiance, {bands: ['B4', 'B3', 'B2'], max: 90}, 'radiance');

// Convert the raw data to top-of-atmosphere reflectance.
var toa = ee.Algorithms.Landsat.TOA(raw);

Map.addLayer(toa, {bands: ['B4', 'B3', 'B2'], max: 0.2}, 'toa reflectance');
// [END earthengine__landsat01__radiance_toa]

// [START earthengine__landsat01__sr_image]
var srImage = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20201028');
// [END earthengine__landsat01__sr_image]

// [START earthengine__landsat01__sr_collections]
var surfaceReflectanceL4 = ee.ImageCollection('LANDSAT/LT04/C02/T1_L2');
var surfaceReflectanceL5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2');
var surfaceReflectanceL7 = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2');
var surfaceReflectanceL8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2');
// [END earthengine__landsat01__sr_collections]


// Checks (not seen by user):
print(srImage);
print(surfaceReflectanceL4.first());
print(surfaceReflectanceL5.first());
print(surfaceReflectanceL7.first());
