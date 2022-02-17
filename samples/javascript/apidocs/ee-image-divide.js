/**
 * Copyright 2022 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_image_divide]
// A Sentinel-2 surface reflectance image.
var img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG');

// Subset two image bands and display them on the map.
var swir1 = img.select('B11');
var swir2 = img.select('B12');
Map.setCenter(-122.276, 37.456, 12);
Map.addLayer(swir1, {min: 0, max: 3000}, 'swir1');
Map.addLayer(swir2, {min: 0, max: 3000}, 'swir2');

// The following examples demonstrate ee.Image arithmetic methods using two
// single-band ee.Image inputs.
var addition = swir1.add(swir2);
Map.addLayer(addition, {min: 100, max: 6000}, 'addition');

var subtraction = swir1.subtract(swir2);
Map.addLayer(subtraction, {min: 0, max: 1500}, 'subtraction');

var multiplication = swir1.multiply(swir2);
Map.addLayer(multiplication, {min: 1.9e5, max: 9.4e6}, 'multiplication');

var division = swir1.divide(swir2);
Map.addLayer(division, {min: 0, max: 3}, 'division');

var remainder = swir1.mod(swir2);
Map.addLayer(remainder, {min: 0, max: 1500}, 'remainder');

// If a number input is provided as the second argument, it will automatically
// be promoted to an ee.Image object, a convenient shorthand for constants.
var exponent = swir1.pow(3);
Map.addLayer(exponent, {min: 0, max: 2e10}, 'exponent');
// [END earthengine__apidocs__ee_image_divide]
