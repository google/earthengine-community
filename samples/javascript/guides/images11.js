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
 *   from 'Images - Morphological operations' page
 */

// [START earthengine__images11__morphology]
// Load a Landsat 8 image, select the NIR band, threshold, display.
var image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')
            .select(4).gt(0.2);
Map.setCenter(-122.1899, 37.5010, 13);
Map.addLayer(image, {}, 'NIR threshold');

// Define a kernel.
var kernel = ee.Kernel.circle({radius: 1});

// Perform an erosion followed by a dilation, display.
var opened = image
             .focalMin({kernel: kernel, iterations: 2})
             .focalMax({kernel: kernel, iterations: 2});
Map.addLayer(opened, {}, 'opened');
// [END earthengine__images11__morphology]
