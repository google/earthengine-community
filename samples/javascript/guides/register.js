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
 *   from 'Images - registering' section
 */

// [START earthengine__register__displacement]
// Load the two images to be registered.
var image1 = ee.Image('SKYSAT/GEN-A/PUBLIC/ORTHO/MULTISPECTRAL/s01_20150502T082736Z');
var image2 = ee.Image('SKYSAT/GEN-A/PUBLIC/ORTHO/MULTISPECTRAL/s01_20150305T081019Z');

// Use bicubic resampling during registration.
var image1Orig = image1.resample('bicubic');
var image2Orig = image2.resample('bicubic');

// Choose to register using only the 'R' band.
var image1RedBand = image1Orig.select('R');
var image2RedBand = image2Orig.select('R');

// Determine the displacement by matching only the 'R' bands.
var displacement = image2RedBand.displacement({
  referenceImage: image1RedBand,
  maxOffset: 50.0,
  patchWidth: 100.0
});

// Compute image offset and direction.
var offset = displacement.select('dx').hypot(displacement.select('dy'));
var angle = displacement.select('dx').atan2(displacement.select('dy'));

// Display offset distance and angle.
Map.addLayer(offset, {min:0, max: 20}, 'offset');
Map.addLayer(angle, {min: -Math.PI, max: Math.PI}, 'angle');
Map.setCenter(37.44,0.58, 15);
// [END earthengine__register__displacement]

// [START earthengine__register__displace]
// Use the computed displacement to register all original bands.
var registered = image2Orig.displace(displacement);

// Show the results of co-registering the images.
var visParams = {bands: ['R', 'G', 'B'], max: 4000};
Map.addLayer(image1Orig, visParams, 'Reference');
Map.addLayer(image2Orig, visParams, 'Before Registration');
Map.addLayer(registered, visParams, 'After Registration');
// [END earthengine__register__displace]

// [START earthengine__register__register]
var alsoRegistered = image2Orig.register({
  referenceImage: image1Orig,
  maxOffset: 50.0,
  patchWidth: 100.0
});
Map.addLayer(alsoRegistered, visParams, 'Also Registered');
// [END earthengine__register__register]
