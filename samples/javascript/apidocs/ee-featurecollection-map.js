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

// [START earthengine__apidocs__ee_featurecollection_map]
// FeatureCollection of power plants in Belgium.
var fc = ee.FeatureCollection('WRI/GPPD/power_plants')
            .filter('country_lg == "Belgium"');

// Function to convert power plant capacity from megawatts to gigawatts and
// add the value as a new feature property.
var mwToGw = function(feature) {
  var megawatt = feature.getNumber('capacitymw');
  var gigawatt = megawatt.divide(1000);
  return feature.set('capacitygw', gigawatt);
};

// Apply the function to each feature in the collection.
fc = fc.map(mwToGw);

print('Note the new "capacitygw" property in each feature', fc);
// [END earthengine__apidocs__ee_featurecollection_map]
