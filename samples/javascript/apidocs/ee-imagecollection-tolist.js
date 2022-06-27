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

// [START earthengine__apidocs__ee_imagecollection_tolist]
// Note: ee.ImageCollection.toList may take a lot of time and memory to run,
// since it must generate all of the results in order to gather them into a
// list. Large collections and/or complex computations can produce memory
// limitation errors.

// A Landsat 8 TOA image collection (1 year of images at a specific point).
var col = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(ee.Geometry.Point(-90.70, 34.71))
  .filterDate('2020-01-01', '2021-01-01');
print('Image collection', col);

// Get the first 3 images as a list of images.
var imgListFirst3 = col.toList(3);
print('First 3 images', imgListFirst3);

// Get the second 3 images as a list of images (use the offset parameter).
var imgListSecond3 = col.toList(3, 3);
print('Second 3 images', imgListSecond3);
// [END earthengine__apidocs__ee_imagecollection_tolist]
