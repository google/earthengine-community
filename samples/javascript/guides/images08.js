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
 *   from 'Images - Relational, conditional and Boolean operations' page
 */

// [START earthengine__images08__conditional]
// Load a 2012 nightlights image.
var nl2012 = ee.Image('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F182012');
var lights = nl2012.select('stable_lights');

// Define arbitrary thresholds on the 6-bit stable lights band.
var zones = lights.gt(30).add(lights.gt(55)).add(lights.gt(62));

// Display the thresholded image as three distinct zones near Paris.
var palette = ['000000', '0000FF', '00FF00', 'FF0000'];
Map.setCenter(2.373, 48.8683, 8);
Map.addLayer(zones, {min: 0, max: 3, palette: palette}, 'development zones');
// [END earthengine__images08__conditional]

// [START earthengine__images08__conditional_exp]
// Create zones using an expression, display.
var zonesExp = nl2012.expression(
    "(b('stable_lights') > 62) ? 3" +
      ": (b('stable_lights') > 55) ? 2" +
        ": (b('stable_lights') > 30) ? 1" +
          ": 0"
);
Map.addLayer(zonesExp,
             {min: 0, max: 3, palette: palette},
             'development zones (ternary)');
// [END earthengine__images08__conditional_exp]
