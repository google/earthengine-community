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
 *   from 'Images - Edge detectors' page
 */

// [START earthengine__images14__zero_crossings]
// Load a Landsat 8 image, select the panchromatic band.
var image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318').select('B8');
Map.addLayer(image, {max: 12000});

// Define a "fat" Gaussian kernel.
var fat = ee.Kernel.gaussian({
  radius: 3,
  sigma: 3,
  units: 'pixels',
  normalize: true,
  magnitude: -1
});

// Define a "skinny" Gaussian kernel.
var skinny = ee.Kernel.gaussian({
  radius: 3,
  sigma: 1,
  units: 'pixels',
  normalize: true,
});

// Compute a difference-of-Gaussians (DOG) kernel.
var dog = fat.add(skinny);

// Compute the zero crossings of the second derivative, display.
var zeroXings = image.convolve(dog).zeroCrossing();
Map.setCenter(-122.054, 37.7295, 10);
Map.addLayer(zeroXings.updateMask(zeroXings), {palette: 'FF0000'}, 'zero crossings');
// [END earthengine__images14__zero_crossings]
