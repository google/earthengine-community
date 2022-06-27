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
 *   from 'Images - Spectral transformations' page
 */

// [START earthengine__images15__pan_sharpening]
// Load a Landsat 8 top-of-atmosphere reflectance image.
var image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318');
Map.addLayer(
    image,
    {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.25, gamma: [1.1, 1.1, 1]},
    'rgb');

// Convert the RGB bands to the HSV color space.
var hsv = image.select(['B4', 'B3', 'B2']).rgbToHsv();

// Swap in the panchromatic band and convert back to RGB.
var sharpened = ee.Image.cat([
  hsv.select('hue'), hsv.select('saturation'), image.select('B8')
]).hsvToRgb();

// Display the pan-sharpened result.
Map.setCenter(-122.44829, 37.76664, 13);
Map.addLayer(sharpened,
             {min: 0, max: 0.25, gamma: [1.3, 1.3, 1.3]},
             'pan-sharpened');
// [END earthengine__images15__pan_sharpening]
