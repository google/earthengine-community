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

"""Earth Engine Developer's Guide examples from 'Joins - Inner MODIS example' section."""

# [START earthengine__joins04__modis_inner]
# Make a date filter to get images in this date range.
date_filter = ee.Filter.date('2014-01-01', '2014-02-01')

# Load a MODIS collection with EVI data.
mcd43a4 = ee.ImageCollection('MODIS/MCD43A4_006_EVI').filter(date_filter)

# Load a MODIS collection with quality data.
mcd43a2 = ee.ImageCollection('MODIS/006/MCD43A2').filter(date_filter)

# Define an inner join.
inner_join = ee.Join.inner()

# Specify an equals filter for image timestamps.
filter_time_eq = ee.Filter.equals(
    leftField='system:time_start', rightField='system:time_start'
)

# Apply the join.
inner_joined_modis = inner_join.apply(mcd43a4, mcd43a2, filter_time_eq)

# Display the join result: a FeatureCollection.
display('Inner join output:', inner_joined_modis)
# [END earthengine__joins04__modis_inner]

# [START earthengine__joins04__inner_merge]
# Map a function to merge the results in the output FeatureCollection.
joined_modis = inner_joined_modis.map(
    lambda feature: ee.Image.cat(
        feature.get('primary'), feature.get('secondary')
    )
)

# Print the result of merging.
display("Inner join, merged 'bands':", joined_modis)
# [END earthengine__joins04__inner_merge]
