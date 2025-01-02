# Copyright 2024 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Earth Engine Developer's Guide examples from 'Reducers - FeatureCollection.reduceColumns' section."""

# [START earthengine__reducers07__reduce_columns]
# Load US census data as a FeatureCollection.
census = ee.FeatureCollection('TIGER/2010/Blocks')

# Filter the collection to include only Benton County, OR.
benton = census.filter(
    ee.Filter.And(
        ee.Filter.eq('statefp10', '41'), ee.Filter.eq('countyfp10', '003')
    )
)

# Display Benton County census blocks.
m = geemap.Map()
m.set_center(-123.27, 44.57, 13)
m.add_layer(benton)
display(m)

# Compute sums of the specified properties.
properties = ['pop10', 'housing10']
sums = benton.filter(ee.Filter.notNull(properties)).reduceColumns(
    reducer=ee.Reducer.sum().repeat(2), selectors=properties
)

# Print the resultant Dictionary.
display(sums)
# [END earthengine__reducers07__reduce_columns]
