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
 *   from 'Landsat Algorithms - Cloud Score' section
 */

// [START earthengine__landsat02__cloud_score]
// Load a cloudy Landsat scene and display it.
var cloudy_scene = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140926');
Map.centerObject(cloudy_scene);
Map.addLayer(cloudy_scene, {bands: ['B4', 'B3', 'B2'], max: 0.4}, 'TOA', false);

// Add a cloud score band.  It is automatically called 'cloud'.
var scored = ee.Algorithms.Landsat.simpleCloudScore(cloudy_scene);

// Create a mask from the cloud score and combine it with the image mask.
var mask = scored.select(['cloud']).lte(20);

// Apply the mask to the image and display the result.
var masked = cloudy_scene.updateMask(mask);
Map.addLayer(masked, {bands: ['B4', 'B3', 'B2'], max: 0.4}, 'masked');
// [END earthengine__landsat02__cloud_score]

// [START earthengine__landsat02__sensor_id]
// Load a Landsat 8 composite and set the SENSOR_ID property.
var mosaic = ee.Image(ee.ImageCollection('LANDSAT/LC8_L1T_8DAY_TOA').first())
  .set('SENSOR_ID', 'OLI_TIRS');

// Cloud score the mosaic and display the result.
var scored_mosaic = ee.Algorithms.Landsat.simpleCloudScore(mosaic);
Map.addLayer(scored_mosaic, {bands: ['B4', 'B3', 'B2'], max: 0.4},
    'TOA mosaic', false);
// [END earthengine__landsat02__sensor_id]
