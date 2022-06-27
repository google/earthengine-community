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

// [START earthengine__apidocs__ee_featurecollection_select]
// FeatureCollection of power plants in Belgium.
var fc = ee.FeatureCollection('WRI/GPPD/power_plants')
            .filter('country_lg == "Belgium"');

// Select a single property.
var singleProp = fc.select('fuel1');
print('Single property selected',
      singleProp.first());

// Select multiple properties.
var multiProp = fc.select(['fuel1', 'capacitymw']);
print('Multiple properties selected',
      multiProp.first());

// Select multiple properties and rename them.
var multiPropRename = fc.select({
  propertySelectors: ['fuel1', 'capacitymw'],
  newProperties: ['Fuel_1', 'Capacity_MW']
});
print('Multiple properties selected, renamed',
      multiPropRename.first());

// Select multiple properties, remove geometry.
var multiPropNoGeom = fc.select({
  propertySelectors: ['fuel1', 'capacitymw'],
  retainGeometry: false
});
print('Multiple properties selected, geometry removed',
      multiPropNoGeom.first());
// [END earthengine__apidocs__ee_featurecollection_select]
