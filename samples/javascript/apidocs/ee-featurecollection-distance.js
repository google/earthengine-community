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

// [START earthengine__apidocs__ee_featurecollection_distance]
// FeatureCollection of power plants in Belgium.
var fc = ee.FeatureCollection('WRI/GPPD/power_plants')
             .filter('country_lg == "Belgium"');

// Generate an image of distance to nearest power plant.
var distance = fc.distance({searchRadius: 50000, maxError: 50});

// Display the image and FeatureCollection on the map.
Map.setCenter(4.56, 50.78, 7);
Map.addLayer(distance, {max: 50000}, 'Distance to power plants');
Map.addLayer(fc, {color: 'red'}, 'Power plants');
// [END earthengine__apidocs__ee_featurecollection_distance]
