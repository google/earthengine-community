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

// [START earthengine__apidocs__ee_featurecollection_randomcolumn]
// FeatureCollection of power plants in Belgium.
var fc = ee.FeatureCollection('WRI/GPPD/power_plants')
            .filter('country_lg == "Belgium"');
print('N features in collection', fc.size());

// Add a uniform distribution random value column to the FeatureCollection.
fc = fc.randomColumn();

// Randomly split the collection into two sets, 30% and 70% of the total.
var randomSample30 = fc.filter('random < 0.3');
print('N features in 30% sample', randomSample30.size());

var randomSample70 = fc.filter('random >= 0.3');
print('N features in 70% sample', randomSample70.size());
// [END earthengine__apidocs__ee_featurecollection_randomcolumn]
