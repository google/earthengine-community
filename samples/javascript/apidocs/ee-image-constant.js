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

// [START earthengine__apidocs__ee_image_constant]
// Create a constant image, where every pixel has bands of the same value.
var image1 = ee.Image.constant(1);
Map.addLayer(image1, null, '1');
// Image (1 band)
// type: Image
// bands: List (1 element)
// 0: "constant", int ∈ [1, 1], EPSG:4326
print(image1);

var image2 = ee.Image(2);
Map.addLayer(image2, null, '2');
// Image (1 band)
// type: Image
// bands: List (1 element)
// 0: "constant", int ∈ [2, 2], EPSG:4326
print(image2);

var π = ee.Image(Math.PI);
Map.addLayer(π, null, 'π');
// Image (1 band)
// type: Image
// bands: List (1 element)
// 0: "constant", double ∈ [3.141592653589793, 3.141592653589793], EPSG:4326
// id: constant
// crs: EPSG:4326
// crs_transform: [1,0,0,0,1,0]
// data_type: double ∈ [3.141592653589793, 3.141592653589793]
print(π);

// Create a multi-band image from a list of constant double integers.
var doubleIntImage = ee.Image.constant([-1.2, 4]);
Map.addLayer(doubleIntImage, null, 'double int');
// Image (2 bands)
// type: Image
// bands: List (2 elements)
// 0: "constant_0", double ∈ [-1.2, -1.2], EPSG:4326
// 1: "constant_1", int ∈ [4, 4], EPSG:4326
print(doubleIntImage);

// Create a multi-band image from a list of constants, using hexadecimal
// notation.
var multiband = ee.Image([0xff, 0x88, 0x00]);
Map.addLayer(multiband, {min: 0, max: 0xff}, 'orange');
// Image (3 bands)
// type: Image
// bands: List (3 elements)
// 0: "constant", int ∈ [255, 255], EPSG:4326
// 1: "constant_1", int ∈ [136, 136], EPSG:4326
// 2: "constant_2", int ∈ [0, 0], EPSG:4326
print(multiband);
// [END earthengine__apidocs__ee_image_constant]
