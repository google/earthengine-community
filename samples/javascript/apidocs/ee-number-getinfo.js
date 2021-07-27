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

// [START earthengine__apidocs__ee_number_getinfo]
/**
 * WARNING: this function transfers data from Earth Engine servers to the
 * client. Doing so can negatively affect request processing and client
 * performance. Server-side options should be used whenever possible.
 * Learn more about the distinction between server and client:
 * https://developers.google.com/earth-engine/guides/client_server
 */

// A server-side ee.Number object.
var numberServer = ee.Number(10.3);

// Use evaluate to transfer server-side number to the client.
var numberClient = numberServer.getInfo();
print('Client-side primitive data type', typeof numberClient);  // number
print('Client-side number', numberClient);  // 10.3
print('Client-side number used in expression', numberClient + 10);  // 20.3
// [END earthengine__apidocs__ee_number_getinfo]
