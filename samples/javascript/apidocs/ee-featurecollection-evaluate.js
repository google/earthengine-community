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

// [START earthengine__apidocs__ee_featurecollection_evaluate]
/**
 * WARNING: this function transfers data from Earth Engine servers to the
 * client. Doing so can negatively affect request processing and client
 * performance. Server-side options should be used whenever possible.
 * Learn more about the distinction between server and client:
 * https://developers.google.com/earth-engine/guides/client_server
 */

// FeatureCollection of power plants in Belgium.
var fcServer = ee.FeatureCollection('WRI/GPPD/power_plants')
             .filter('country_lg == "Belgium"');

fcServer.evaluate(function(fcClient) {
  print('Client-side feature collection is an object', typeof fcClient);
  print('Feature collection object keys', Object.keys(fcClient));
  print('Array of features', fcClient.features);
  print('Properties for first feature', fcClient.features[0].properties);
});
// [END earthengine__apidocs__ee_featurecollection_evaluate]
