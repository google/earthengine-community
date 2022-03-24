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
 *   from 'Mapping' page
 */

// [START earthengine__image_collections04__time_band]
// Load a Landsat 8 collection for a single path-row, 2021 images only.
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterDate('2021', '2022')
  .filter(ee.Filter.eq('WRS_PATH', 44))
  .filter(ee.Filter.eq('WRS_ROW', 34));

// This function adds a band representing the image timestamp.
var addTime = function(image) {
  return image.addBands(image.getNumber('system:time_start'));
};

// Map the function over the collection and display the result.
print(collection.map(addTime));
// [END earthengine__image_collections04__time_band]

// [START earthengine__image_collections04__if]
// Load a Landsat 8 collection for a single path-row, 2021 images only.
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterDate('2021', '2022')
  .filter(ee.Filter.eq('WRS_PATH', 44))
  .filter(ee.Filter.eq('WRS_ROW', 34));

// This function uses a conditional statement to return the image if
// the solar elevation > 40 degrees. Otherwise it returns a "zero image".
var conditional = function(image) {
  return ee.Algorithms.If(ee.Number(image.get('SUN_ELEVATION')).gt(40),
                          image,
                          ee.Image(0));
};

// Map the function over the collection and print the result. Expand the
// collection and note that 7 of the 22 images are now "zero images'.
print('Expand this to see the result', collection.map(conditional));
// [END earthengine__image_collections04__if]
