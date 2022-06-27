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

// [START earthengine__apidocs__ee_imagecollection_tobands]
// A Landsat 8 TOA image collection (2 months of images at a specific point).
var col = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(ee.Geometry.Point(-90.70, 34.71))
  .filterDate('2020-07-01', '2020-09-01')
  .select('B[4-5]');  // Get NIR and SWIR1 bands only.
print('Collection', col);

// Convert the image collection to a single multi-band image. Note that image ID
// ('system:index') is prepended to band names to delineate the source images.
var img = col.toBands();
print('Collection to bands', img);

// Band order is determined by collection order. Here, the collection is
// sorted in descending order of the date of observation (reverse of previous).
var bandOrder = col.sort('DATE_ACQUIRED', false).toBands();
print('Customized band order', bandOrder);
// [END earthengine__apidocs__ee_imagecollection_tobands]
