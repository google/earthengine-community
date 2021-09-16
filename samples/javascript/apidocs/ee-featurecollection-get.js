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

// [START earthengine__apidocs__ee_featurecollection_get]
// A global power plant FeatureCollection.
var fc = ee.FeatureCollection('WRI/GPPD/power_plants');

// View a list of FeatureCollection property names.
print(fc.propertyNames());

// Get the value of a listed property.
print('Global power plant data provider as ee.ComputedObject',
      fc.get('provider'));

// The returned value is an ee.ComputedObject which has no methods available for
// further processing; cast to the relevant Earth Engine object class for use.
print('Global power plant data provider as ee.String',
      ee.String(fc.get('provider')));
// [END earthengine__apidocs__ee_featurecollection_get]
