/**
 * Copyright 2023 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_algorithms_image_segmentation_snic]
// Note that the compactness and size parameters can have a significant impact
// on the result. They must be adjusted to meet image-specific characteristics
// and patterns, typically through trial. Pixel scale (map zoom level) is also
// important to consider. When exploring interactively through map tile
// visualization, the segmentation result it dependent on zoom level. If you
// need to evaluate the result at a specific scale, call .reproject() on the
// result, but do so with caution because it overrides the default scaling
// behavior that makes tile computation fast and efficient.


// Load a NAIP image for a neighborhood in Las Vegas.
var naip = ee.Image('USDA/NAIP/DOQQ/m_3611554_sw_11_1_20170613');

// Apply the SNIC algorithm to the image.
var snic = ee.Algorithms.Image.Segmentation.SNIC({
  image: naip,
  size: 30,
  compactness: 0.1,
  connectivity: 8,
});

// Display the original NAIP image as RGB.
// Lock map zoom to maintain the desired scale of the segmentation computation.
Map.setLocked(false, 18, 18);
Map.setCenter(-115.32053, 36.182016, 18);
Map.addLayer(naip, null, 'NAIP RGB');

// Display the clusters.
Map.addLayer(snic.randomVisualizer(), null, 'Clusters');

// Display the RGB cluster means.
var visParams = {
  bands: ['R_mean', 'G_mean', 'B_mean'],
  min: 0,
  max: 255
};
Map.addLayer(snic, visParams, 'RGB cluster means');
// [END earthengine__apidocs__ee_algorithms_image_segmentation_snic]
