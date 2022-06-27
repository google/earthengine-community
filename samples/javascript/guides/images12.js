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
 *   from 'Images - Gradients' page
 */

// [START earthengine__images12__gradients]
// Load a Landsat 8 image and select the panchromatic band.
var image = ee.Image('LANDSAT/LC08/C02/T1/LC08_044034_20140318').select('B8');

// Compute the image gradient in the X and Y directions.
var xyGrad = image.gradient();

// Compute the magnitude of the gradient.
var gradient = xyGrad.select('x').pow(2)
          .add(xyGrad.select('y').pow(2)).sqrt();

// Compute the direction of the gradient.
var direction = xyGrad.select('y').atan2(xyGrad.select('x'));

// Display the results.
Map.setCenter(-122.054, 37.7295, 10);
Map.addLayer(direction, {min: -2, max: 2, format: 'png'}, 'direction');
Map.addLayer(gradient, {min: -7, max: 7, format: 'png'}, 'gradient');
// [END earthengine__images12__gradients]
