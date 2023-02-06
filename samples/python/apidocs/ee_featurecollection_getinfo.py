# Copyright 2023 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START earthengine__apidocs__ee_featurecollection_getinfo]
"""WARNING: this function transfers data from Earth Engine servers to the
client. Doing so can negatively affect request processing and client
performance. Server-side options should be used whenever possible.
Learn more about the distinction between server and client:
https://developers.google.com/earth-engine/guides/client_server
"""

# A server-side ee.FeatureCollection of power plants in Belgium.
fc_server = ee.FeatureCollection('WRI/GPPD/power_plants').filter(
    'country_lg == "Belgium"')

# Use getInfo to transfer server-side feature collection to the client. The
# result is an object.
fc_client = fc_server.getInfo()
print('Client-side feature collection is a dictionary:', type(fc_client))
print('Feature collection dictionary keys:', fc_client.keys())
print('Array of features:', fc_client['features'])
print('Properties of first feature:', fc_client['features'][0]['properties'])
# [END earthengine__apidocs__ee_featurecollection_getinfo]
