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

// [START earthengine__apidocs__ee_date_evaluate]
/**
 * WARNING: this function transfers data from Earth Engine servers to the
 * client. Doing so can negatively affect request processing and client
 * performance. Server-side options should be used whenever possible.
 * Learn more about the distinction between server and client:
 * https://developers.google.com/earth-engine/guides/client_server
 */

// A server-side ee.Date object.
var dateServer = ee.Date('2021-4-30');

// Use evaluate to transfer server-side date to the client. The result is
// an object with keys "type" and "value" where "value" is milliseconds since
// Unix epoch.
dateServer.evaluate(function(dateClient) {
  print('Client-side date is an object', typeof dateClient);
  print('Object keys include "type" and "value"', Object.keys(dateClient));
  print('"value" is milliseconds since Unix epoch', dateClient.value);
  print('Client-side date in JS Date constructor', new Date(dateClient.value));
});
// [END earthengine__apidocs__ee_date_evaluate]
