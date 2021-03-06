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
 *   from 'Images - Cumulative Cost' page
 */

// [START earthengine__cumulativeCost__cost]
// A rectangle representing Bangui, Central African Republic.
var geometry = ee.Geometry.Rectangle([18.5229, 4.3491, 18.5833, 4.4066]);

// Create a source image where the geometry is 1, everything else is 0.
var sources = ee.Image().toByte().paint(geometry, 1);

// Mask the sources image with itself.
sources = sources.selfMask();

// The cost data is generated from classes in ESA/GLOBCOVER.
var cover = ee.Image('ESA/GLOBCOVER_L4_200901_200912_V2_3').select(0);

// Classes 60, 80, 110, 140 have cost 1.
// Classes 40, 90, 120, 130, 170 have cost 2.
// Classes 50, 70, 150, 160 have cost 3.
var beforeRemap = [60, 80, 110, 140,
                   40, 90, 120, 130, 170,
                   50, 70, 150, 160];
var afterRemap = [1, 1, 1, 1,
                  2, 2, 2, 2, 2,
                  3, 3, 3, 3];
var cost = cover.remap(beforeRemap, afterRemap, 0);

// Compute the cumulative cost to traverse the land cover.
var cumulativeCost = cost.cumulativeCost({
  source: sources,
  maxDistance: 80 * 1000  // 80 kilometers
});

// Display the results
Map.setCenter(18.71, 4.2, 9);
Map.addLayer(cover, {}, 'Globcover');
Map.addLayer(cumulativeCost, {min: 0, max: 5e4}, 'accumulated cost');
Map.addLayer(geometry, {color: 'FF0000'}, 'source geometry');
// [END earthengine__cumulativeCost__cost]
