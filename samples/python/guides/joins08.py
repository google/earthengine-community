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

"""Earth Engine Developer's Guide examples from 'Joins - Spatial joins' section."""

# [START earthengine__joins08__spatial_join]
import altair as alt

# Load the primary collection: US state boundaries.
states = ee.FeatureCollection('TIGER/2018/States')

# Load the secondary collection: power plants.
power_plants = ee.FeatureCollection('WRI/GPPD/power_plants')

# Define a spatial filter as geometries that intersect.
spatial_filter = ee.Filter.intersects(
    leftField='.geo', rightField='.geo', maxError=10
)

# Define a save all join.
save_all_join = ee.Join.saveAll(matchesKey='power_plants')

# Apply the join.
intersect_joined = save_all_join.apply(states, power_plants, spatial_filter)

# Add power plant count per state as a property.
intersect_joined = intersect_joined.map(
    lambda state:
    # Get "power_plant" intersection list, count how many intersected this state.
    # Return the state feature with a new property: power plant count.
    state.set('n_power_plants', ee.List(state.get('power_plants')).size())
)

# Make a bar chart for the number of power plants per state.
joined_dataframe = ee.data.computeFeatures(
    {'expression': intersect_joined, 'fileFormat': 'PANDAS_DATAFRAME'}
)
chart = (
    alt.Chart(joined_dataframe)
    .mark_bar()
    .encode(
        alt.X('NAME:N').title('State'),
        alt.Y('n_power_plants:Q').title('Frequency'),
    )
    .properties(title='Power plants per state')
)

display(chart)
# [END earthengine__joins08__spatial_join]
