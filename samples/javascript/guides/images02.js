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
 *   from 'Images - Creating images' page
 */

// [START earthengine__images02__create_image]
// Create a constant image.
var image1 = ee.Image(1);
print(image1);

// Concatenate two images into one multi-band image.
var image2 = ee.Image(2);
var image3 = ee.Image.cat([image1, image2]);
print(image3);

// Create a multi-band image from a list of constants.
var multiband = ee.Image([1, 2, 3]);
print(multiband);

// Select and (optionally) rename bands.
var renamed = multiband.select(
    ['constant', 'constant_1', 'constant_2'], // old names
    ['band1', 'band2', 'band3']               // new names
);
print(renamed);

// Add bands to an image.
var image4 = image3.addBands(ee.Image(42));
print(image4);
// [END earthengine__images02__create_image]
