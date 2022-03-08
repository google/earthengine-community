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
 *   from 'Images - Relational, conditional and Boolean operations' page
 */

// [START earthengine__images09__where_operator]
// Load a cloudy Sentinel-2 image.
var image = ee.Image(
  'COPERNICUS/S2_SR/20210114T185729_20210114T185730_T10SEG');
Map.addLayer(image,
             {bands: ['B4', 'B3', 'B2'], min: 0, max: 2000},
             'original image');

// Load another image to replace the cloudy pixels.
var replacement = ee.Image(
  'COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG');

// Set cloudy pixels (greater than 5% probability) to the other image.
var replaced = image.where(image.select('MSK_CLDPRB').gt(5), replacement);

// Display the result.
Map.setCenter(-122.3769, 37.7349, 11);
Map.addLayer(replaced,
             {bands: ['B4', 'B3', 'B2'], min: 0, max: 2000},
             'clouds replaced');
// [END earthengine__images09__where_operator]
