/**
 * Copyright 2021 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_imagecollection_first]
var image = ee.ImageCollection('COPERNICUS/S2_SR').first();
Map.centerObject(image, 8);
var vis = {bands: ['B4', 'B3', 'B2'], min: 0, max: 5000};
Map.addLayer(image, vis, 'first of S2_SR');

// Display the image metadata.
print(image);
// [END earthengine__apidocs__ee_imagecollection_first]
