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

// [START earthengine__images13__canny]
// Load a Landsat 8 image, select the panchromatic band.
var image = ee.Image('LANDSAT/LC08/C02/T1/LC08_044034_20140318').select('B8');

// Perform Canny edge detection and display the result.
var canny = ee.Algorithms.CannyEdgeDetector({
  image: image, threshold: 10, sigma: 1
});
Map.setCenter(-122.054, 37.7295, 10);
Map.addLayer(canny, {}, 'canny');
// [END earthengine__images13__canny]

// [START earthengine__images13__hough]
// Perform Hough transform of the Canny result and display.
var hough = ee.Algorithms.HoughTransform(canny, 256, 600, 100);
Map.addLayer(hough, {}, 'hough');
// [END earthengine__images13__hough]
