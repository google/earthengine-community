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

// [START earthengine__apidocs__ee_feature_buffer]
// Polygon feature of Serengeti National Park.
var feature = ee.FeatureCollection('WCMC/WDPA/202307/polygons')
                  .filter('ORIG_NAME == "Serengeti National Park"')
                  .first();

// Cast the resulting object as an ee.Feature so that the call to the buffer
// method is unambiguous (first() and buffer() are shared by multiple classes).
feature = ee.Feature(feature);

// Generate buffered features out and in from the original boundary.
var bufferOut = feature.buffer(10000);  // 10 km out
var bufferIn = feature.buffer(-10000);  // 10 km in

// Display the features on the map.
Map.addLayer(bufferOut, {color: 'red'}, 'Buffer out');
Map.addLayer(feature, {color: 'blue'}, 'No buffer');
Map.addLayer(bufferIn, {color: 'yellow'}, 'Buffer in');
Map.setCenter(34.8407, -2.398, 8);
// [END earthengine__apidocs__ee_feature_buffer]
