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

# [START earthengine__apidocs__ee_featurecollection_select]
# FeatureCollection of power plants in Belgium.
fc = ee.FeatureCollection('WRI/GPPD/power_plants').filter(
    'country_lg == "Belgium"')

# Select a single property.
single_prop = fc.select('fuel1')
display('Single property selected:', single_prop.first())

# Select multiple properties.
multi_prop = fc.select(['fuel1', 'capacitymw'])
display('Multiple properties selected:', multi_prop.first())

# Select multiple properties and rename them.
multi_prop_rename = fc.select(**{
    'propertySelectors': ['fuel1', 'capacitymw'],
    'newProperties': ['Fuel_1', 'Capacity_MW']
    })
display('Multiple properties selected, renamed:',
        multi_prop_rename.first())

# Select multiple properties, remove geometry.
multi_prop_no_geom = fc.select(**{
    'propertySelectors': ['fuel1', 'capacitymw'],
    'retainGeometry': False
    })
display('Multiple properties selected, geometry removed:',
        multi_prop_no_geom.first())
# [END earthengine__apidocs__ee_featurecollection_select]
