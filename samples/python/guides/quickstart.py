# Copyright 2024 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Google Earth Engine Developer's Guide examples for 'Python quickstart'."""

# [START earthengine__quickstart__imports]
import ee
import geemap.core as geemap
# [END earthengine__quickstart__imports]

# [START earthengine__quickstart__auth]
ee.Authenticate()
ee.Initialize(project='PROJECT_ID')
# [END earthengine__quickstart__auth]

# [START earthengine__quickstart__image_load]
jan_2023_climate = (
    ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR')
    .filterDate('2023-01', '2023-02')
    .first()
)
jan_2023_climate
# [END earthengine__quickstart__image_load]

# [START earthengine__quickstart__image_display]
m = geemap.Map(center=[30, 0], zoom=2)

vis_params = {
    'bands': ['temperature_2m'],
    'min': 229,
    'max': 304,
    'palette': 'inferno',
}
m.add_layer(jan_2023_climate, vis_params, 'Temperature (K)')
m
# [END earthengine__quickstart__image_display]

# [START earthengine__quickstart__fc_create]
cities = ee.FeatureCollection([
    ee.Feature(ee.Geometry.Point(10.75, 59.91), {'city': 'Oslo'}),
    ee.Feature(ee.Geometry.Point(-118.24, 34.05), {'city': 'Los Angeles'}),
    ee.Feature(ee.Geometry.Point(103.83, 1.33), {'city': 'Singapore'}),
])
cities
# [END earthengine__quickstart__fc_create]

# [START earthengine__quickstart__fc_display]
m.add_layer(cities, name='Cities')
m
# [END earthengine__quickstart__fc_display]

# [START earthengine__quickstart__import_altair]
%pip install -q --upgrade altair
import altair as alt
# [END earthengine__quickstart__import_altair]

# [START earthengine__quickstart__extract_data]
city_climates = jan_2023_climate.reduceRegions(cities, ee.Reducer.first())

city_climates_dataframe = ee.data.computeFeatures(
    {'expression': city_climates, 'fileFormat': 'PANDAS_DATAFRAME'}
)
city_climates_dataframe
# [END earthengine__quickstart__extract_data]

# [START earthengine__quickstart__plot_data]
alt.Chart(city_climates_dataframe).mark_bar(size=100).encode(
    alt.X('city:N', sort='y', axis=alt.Axis(labelAngle=0), title='City'),
    alt.Y('temperature_2m:Q', title='Temperature (K)'),
    tooltip=[
        alt.Tooltip('city:N', title='City'),
        alt.Tooltip('temperature_2m:Q', title='Temperature (K)'),
    ],
).properties(title='January 2023 temperature for selected cities', width=500)
# [END earthengine__quickstart__plot_data]
