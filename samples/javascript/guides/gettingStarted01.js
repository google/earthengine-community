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
 *   from 'Earth Engine Algorithms' section.
 */

// placeholded imports
var dem = ee.Image('USGS/SRTMGL1_003');
var collection1 = ee.ImageCollection('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS');

// dummy variables
var image1 = ee.Image(1);
var image2 = ee.Image(2);

// [START earthengine__gettingStarted01__image_add_method]
var image3 = image1.add(image2);
// [END earthengine__gettingStarted01__image_add_method]

// [START earthengine__gettingStarted01__ee_algo]
var terrainImage = ee.Algorithms.Terrain(dem);
// [END earthengine__gettingStarted01__ee_algo]

// [START earthengine__gettingStarted01__user_function]
var myFunction = function(args) {
  // do something
  return something;
};
// [END earthengine__gettingStarted01__user_function]

// dummy function
var aFunction = function(image) {
  return image;
};

// [START earthengine__gettingStarted01__collection_map]
var collection2 = collection1.map(aFunction);
// [END earthengine__gettingStarted01__collection_map]
