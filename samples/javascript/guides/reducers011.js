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
 *   from 'Reducers - Image reduce' section
 */

// [START earthengine__reducers011__image_reduce]
// Load an image and select some bands of interest.
var image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318')
    .select(['B4', 'B3', 'B2']);

// Reduce the image to get a one-band maximum value image.
var maxValue = image.reduce(ee.Reducer.max());

// Display the result.
Map.centerObject(image, 10);
Map.addLayer(maxValue, {max: 13000}, 'Maximum value image');
// [END earthengine__reducers011__image_reduce]
