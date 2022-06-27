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

// [START earthengine__apidocs__ee_featurecollection_todictionary]
// FeatureCollection of power plants.
var fc = ee.FeatureCollection('WRI/GPPD/power_plants');

print('All non-system FeatureCollection properties as an ee.Dictionary',
      fc.toDictionary());
print('Selected properties as an ee.Dictionary',
      fc.toDictionary(['description', 'provider']));
// [END earthengine__apidocs__ee_featurecollection_todictionary]
