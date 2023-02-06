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

# [START earthengine__apidocs__ee_featurecollection_reducecolumns]
# FeatureCollection of power plants in Belgium.
fc = ee.FeatureCollection('WRI/GPPD/power_plants').filter(
    'country_lg == "Belgium"')

# Calculate mean of a single FeatureCollection property.
prop_mean = fc.reduceColumns(**{
    'reducer': ee.Reducer.mean(),
    'selectors': ['gwh_estimt']
    })
print('Mean of a single property:', prop_mean.getInfo())

# Calculate mean of multiple FeatureCollection properties.
props_mean = fc.reduceColumns(**{
    'reducer': ee.Reducer.mean().repeat(2),
    'selectors': ['gwh_estimt', 'capacitymw']
    })
print('Mean of multiple properties:', props_mean.getInfo())


# Calculate weighted mean of a single FeatureCollection property. Add a fuel
# source weight property to the FeatureCollection.
def get_fuel(feature):
  return feature.set('weight', fuel_weights.getNumber(feature.get('fuel1')))

fuel_weights = ee.Dictionary({
    'Wind': 0.9,
    'Gas': 0.2,
    'Oil': 0.2,
    'Coal': 0.1,
    'Hydro': 0.7,
    'Biomass': 0.5,
    'Nuclear': 0.3
    })

fc = fc.map(get_fuel)

weighted_mean = fc.reduceColumns(**{
    'reducer': ee.Reducer.mean(),
    'selectors': ['gwh_estimt'],
    'weightSelectors': ['weight']
    })
print('Weighted mean of a single property:', weighted_mean.getInfo())
# [END earthengine__apidocs__ee_featurecollection_reducecolumns]
