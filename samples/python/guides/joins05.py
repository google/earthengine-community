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

"""Earth Engine Developer's Guide examples from 'Joins - Save All' section."""

# [START earthengine__joins05__save_all]
# Load a primary collection: Landsat imagery.
primary = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterDate('2014-04-01', '2014-06-01')
    .filterBounds(ee.Geometry.Point(-122.092, 37.42))
)

# Load a secondary collection: MODIS imagery.
mod_secondary = ee.ImageCollection('MODIS/006/MOD09GA').filterDate(
    '2014-03-01', '2014-07-01'
)

# Define an allowable time difference: two days in milliseconds.
two_days_millis = 2 * 24 * 60 * 60 * 1000

# Create a time filter to define a match as overlapping timestamps.
time_filter = ee.Filter.Or(
    ee.Filter.maxDifference(
        difference=two_days_millis,
        leftField='system:time_start',
        rightField='system:time_end',
    ),
    ee.Filter.maxDifference(
        difference=two_days_millis,
        leftField='system:time_end',
        rightField='system:time_start',
    ),
)

# Define the join.
save_all_join = ee.Join.saveAll(
    matchesKey='terra', ordering='system:time_start', ascending=True
)

# Apply the join.
landsat_modis = save_all_join.apply(primary, mod_secondary, time_filter)

# Display the result.
display('Join.saveAll:', landsat_modis)
# [END earthengine__joins05__save_all]
