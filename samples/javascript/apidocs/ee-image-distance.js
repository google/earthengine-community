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

// [START earthengine__apidocs__ee_image_distance]
// The objective is to determine the per-pixel distance to a target
// feature (pixel value). In this example, the target feature is water in a
// land cover map.

// Import a Dynamic World land cover image and subset the 'label' band.
var lcImg = ee.Image(
  'GOOGLE/DYNAMICWORLD/V1/20210726T171859_20210726T172345_T14TQS')
  .select('label');

// Create a binary image where the target feature is value 1, all else 0.
// In the Dynamic World map, water is represented as value 0, so we use the
// ee.Image.eq() relational operator to set it to 1.
var targetImg = lcImg.eq(0);

// Set a max distance from target pixels to consider in the analysis. Pixels
// with distance greater than this value from target pixels will be masked out.
// Here, we are using units of meters, but the distance kernels also accept
// units of pixels.
var maxDistM = 10000;  // 10 km

// Calculate distance to target pixels. Several distance kernels are provided.

// Euclidean distance.
var euclideanKernel = ee.Kernel.euclidean(maxDistM, 'meters');
var euclideanDist = targetImg.distance(euclideanKernel);
var vis = {min: 0, max: maxDistM};
Map.setCenter(-95.68, 46.46, 9);
Map.addLayer(euclideanDist, vis, 'Euclidean distance to target pixels');

// Manhattan distance.
var manhattanKernel = ee.Kernel.manhattan(maxDistM, 'meters');
var manhattanDist = targetImg.distance(manhattanKernel);
Map.addLayer(manhattanDist, vis, 'Manhattan distance to target pixels', false);

// Chebyshev distance.
var chebyshevKernel = ee.Kernel.chebyshev(maxDistM, 'meters');
var chebyshevDist = targetImg.distance(chebyshevKernel);
Map.addLayer(chebyshevDist, vis, 'Chebyshev distance to target pixels', false);

// Add the target layer to the map; water is blue, all else masked out.
Map.addLayer(targetImg.mask(targetImg), {palette: 'blue'}, 'Target pixels');
// [END earthengine__apidocs__ee_image_distance]
