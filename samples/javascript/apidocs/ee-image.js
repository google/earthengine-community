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

// [START earthengine__apidocs__ee_image]
var image = ee.Image('JAXA/ALOS/AW3D30/V2_2');

Map.setZoom(3);
Map.addLayer(image.select('AVE_DSM'), {min: -1e3, max: 5e3}, 'AVE_DSM');
// Image JAXA/ALOS/AW3D30/V2_2 (3 bands)
// type: Image
// id: JAXA/ALOS/AW3D30/V2_2
// version: 1595337806697615
// bands: List (3 elements)
// properties: Object (21 properties)
print(image);

var transparent = ee.Image();
Map.addLayer(transparent, null, 'transparent', false);
// Image (1 band)
// type: Image
// bands: List (1 element)
// 0: "constant", int ∈ [0, 0], EPSG:4326
print(transparent);

// Create a multi-band image from a list of constants.
var orange = ee.Image([0xff, 0x88, 0x00]);
Map.addLayer(orange, {min: 0, max: 0xff}, 'orange', false);
// Image (3 bands)
// type: Image
// bands: List (3 elements)
// 0: "constant", int ∈ [255, 255], EPSG:4326
// 1: "constant_1", int ∈ [136, 136], EPSG:4326
// 2: "constant_2", int ∈ [0, 0], EPSG:4326
print(orange);

// Create a one band image where each pixel is an array of three values.
var imageOfArray = ee.Image(ee.Array([0x00, 0x00, 0xff]));
Map.addLayer(imageOfArray, null, 'imageOfArray', false);
// Image (1 band)
// type: Image
// bands: List (1 element)
// 0: "constant", unsigned int8, 1 dimension, EPSG:4326
// id: constant
// crs: EPSG:4326
// crs_transform: [1,0,0,0,1,0]
// data_type: unsigned int8, 1 dimension
// type: PixelType
// dimensions: 1
// max: 255
// min: 0
// precision: int
print(imageOfArray);
// [END earthengine__apidocs__ee_image]
