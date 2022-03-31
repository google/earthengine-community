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

// [START earthengine__apidocs__ee_image_addbands]
// A Sentinel-2 surface reflectance image.
var img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG');
print('Original image', img);

// Scale reflectance bands and overwrite the original bands.
var reflBands = img.select('B.*').divide(10000);
img = img.addBands({
  srcImg: reflBands,
  overwrite: true
});

// Compute and add a single band (NDVI).
var ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI');
img = img.addBands(ndvi);

// Compute and add multiple bands (NDWI and NBR).
var ndwi = img.normalizedDifference(['B3', 'B8']).rename('NDWI');
var nbr = img.normalizedDifference(['B8', 'B12']).rename('NBR');
var newBands = ee.Image([ndwi, nbr]);
img = img.addBands(newBands);

print('Image with added/modified bands', img);
// [END earthengine__apidocs__ee_image_addbands]
