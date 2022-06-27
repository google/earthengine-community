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

// [START earthengine__apidocs__ee_featurecollection_makearray]
// FeatureCollection of power plants in Belgium.
var fc = ee.FeatureCollection('WRI/GPPD/power_plants')
            .filter('country_lg == "Belgium"');

// A list of feature properties to combine into an array
// (power generation by year).
var properties = ['gwh_2013', 'gwh_2014', 'gwh_2015', 'gwh_2016'];

// Add array of power-generation-by-year property to features.
fc = fc.makeArray(properties, 'gwh_by_year');

print('FeatureCollection with array of selected properties added', fc);
print('See example of new "gwh_by_year" property', fc.first().toDictionary());
// [END earthengine__apidocs__ee_featurecollection_makearray]
