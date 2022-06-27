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

// [START earthengine__apidocs__ee_featurecollection_aside]
// Get a FeatureCollection of power plants in Belgium. Use "aside" to print the
// collection and display it on the Map.
var fc = ee.FeatureCollection('WRI/GPPD/power_plants')
             .filter('country_lg == "Belgium"')
             .aside(print, 'Power plants in Belgium')
             .aside(Map.centerObject, 7)
             .aside(Map.addLayer, {color: 'blue'}, 'Power plants');
// [END earthengine__apidocs__ee_featurecollection_aside]
