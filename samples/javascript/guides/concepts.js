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
*   from 'Concepts' section
*/

// [START earthengine__concepts__client_string]
var clientString = 'I am a String';
print(typeof clientString);  // string
// [END earthengine__concepts__client_string]

// [START earthengine__concepts__server_string]
var serverString = ee.String('I am not a String!');
print(typeof serverString);  // object
print('Is this an EE object?',
    serverString instanceof ee.ComputedObject);  // true
// [END earthengine__concepts__server_string]

// [START earthengine__concepts__print_string]
print(serverString);  // I am not a String
// [END earthengine__concepts__print_string]

// [START earthengine__concepts__to_string]
print(serverString.toString());  // ee.String("I am not a String!")
// [END earthengine__concepts__to_string]

// [START earthengine__concepts__get_info]
var someString = serverString.getInfo();
var strings = someString + '  Am I?';
print(strings);  // I am not a String!  Am I?
// [END earthengine__concepts__get_info]

// [START earthengine__concepts__for_loop]
var clientList = [];
for(var i = 0; i < 8; i++) {
  clientList.push(i + 1);
}
print(clientList);
// [END earthengine__concepts__for_loop]

// [START earthengine__concepts__mapped_function]
var serverList = ee.List.sequence(0, 7);
serverList = serverList.map(function(n) {
  return ee.Number(n).add(1);
});
print(serverList);
// [END earthengine__concepts__mapped_function]

// [START earthengine__concepts__client_to_server]
var toServerList = ee.List(clientList);
// [END earthengine__concepts__client_to_server]

// [START earthengine__concepts__server_boolean]
var myList = ee.List([1, 2, 3]);
var serverBoolean = myList.contains(5);
print(serverBoolean);  // false
// [END earthengine__concepts__server_boolean]

// [START earthengine__concepts__bad_conditional]
var clientConditional;
if (serverBoolean) {
  clientConditional = true;
} else {
  clientConditional = false;
}
print('Should be false:', clientConditional);  // True!
// [END earthengine__concepts__bad_conditional]

// [START earthengine__concepts__good_conditional]
var serverConditional = ee.Algorithms.If(serverBoolean, 'True!', 'False!');
print('Should be false:', serverConditional);  // False!
// [END earthengine__concepts__good_conditional]

// [START earthengine__concepts__scripting]
var image = ee.Image('CGIAR/SRTM90_V4');
var operation = image.add(10);
print(operation.toString());
print(operation);
// [END earthengine__concepts__scripting]

// [START earthengine__concepts__scale]
var image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318').select('B4');

var printAtScale = function(scale) {
  print('Pixel value at '+scale+' meters scale',
    image.reduceRegion({
      reducer: ee.Reducer.first(),
      geometry: image.geometry().centroid(),
      // The scale determines the pyramid level from which to pull the input
      scale: scale
  }).get('B4'));
};

printAtScale(10); // 8883
printAtScale(30); // 8883
printAtScale(50); // 8337
printAtScale(70); // 9215
printAtScale(200); // 8775
printAtScale(500); // 8300
// [END earthengine__concepts__scale]

// [START earthengine__concepts__map_scale]
var image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318');
Map.centerObject(image, 17);
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], max: 12000}, 'image');
// [END earthengine__concepts__map_scale]

// [START earthengine__concepts__projection]
var image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318').select(0);
print('Projection, crs, and crs_transform:', image.projection());
print('Scale in meters:', image.projection().nominalScale());
// [END earthengine__concepts__projection]

// [START earthengine__concepts__default_projection]
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1');
var mosaic = collection.mosaic();
print(mosaic.projection());
// [END earthengine__concepts__default_projection]

// [START earthengine__concepts__projections1]
// The input image has a SR-ORG:6974 (sinusoidal) projection.
var image = ee.Image('MODIS/006/MOD13A1/2014_05_09').select(0);

// Normalize the image and add it to the map.
var rescaled = image.unitScale(-2000, 10000);
var visParams = {min: 0.15, max: 0.7};
Map.addLayer(rescaled, visParams, 'Rescaled');
// [END earthengine__concepts__projections1]

// [START earthengine__concepts__reproject]
// The input image has a SR-ORG:6974 (sinusoidal) projection.
var image = ee.Image('MODIS/006/MOD13A1/2014_05_09').select(0);

// Operations *before* the reproject call will be done in the projection
// specified by reproject().  The output results in another reprojection.
var reprojected = image
    .unitScale(-2000, 10000)
    .reproject('EPSG:4326', null, 500);
Map.addLayer(reprojected, {min: 0.15, max: 0.7}, 'Reprojected');
// [END earthengine__concepts__reproject]
