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

// [START earthengine__apidocs__ee_featurecollection_reducecolumns]
// FeatureCollection of power plants in Belgium.
var fc = ee.FeatureCollection('WRI/GPPD/power_plants')
            .filter('country_lg == "Belgium"');

// Calculate mean of a single FeatureCollection property.
var propMean = fc.reduceColumns({
  reducer: ee.Reducer.mean(),
  selectors: ['gwh_estimt']
});
print('Mean of a single property', propMean);

// Calculate mean of multiple FeatureCollection properties.
var propsMean = fc.reduceColumns({
  reducer: ee.Reducer.mean().repeat(2),
  selectors: ['gwh_estimt', 'capacitymw']
});
print('Mean of multiple properties', propsMean);

// Calculate weighted mean of a single FeatureCollection property. Add a fuel
// source weight property to the FeatureCollection.
var fuelWeights = ee.Dictionary({
  Wind: 0.9,
  Gas: 0.2,
  Oil: 0.2,
  Coal: 0.1,
  Hydro: 0.7,
  Biomass: 0.5,
  Nuclear: 0.3
});
fc = fc.map(function(feature) {
  return feature.set('weight', fuelWeights.getNumber(feature.get('fuel1')));
});

var weightedMean = fc.reduceColumns({
  reducer: ee.Reducer.mean(),
  selectors: ['gwh_estimt'],
  weightSelectors: ['weight']
});
print('Weighted mean of a single property', weightedMean);
// [END earthengine__apidocs__ee_featurecollection_reducecolumns]
