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

"""Earth Engine Developer's Guide examples from 'Joins - Save Best' section."""

# [START earthengine__joins06__save_best]
# Load a primary collection: Landsat imagery.
primary = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterDate('2014-04-01', '2014-06-01')
    .filterBounds(ee.Geometry.Point(-122.092, 37.42))
)

# Load a secondary collection: GRIDMET meteorological data
gridmet = ee.ImageCollection('IDAHO_EPSCOR/GRIDMET')

# Define a max difference filter to compare timestamps.
max_diff_filter = ee.Filter.maxDifference(
    difference=2 * 24 * 60 * 60 * 1000,
    leftField='system:time_start',
    rightField='system:time_start',
)

# Define the join.
save_best_join = ee.Join.saveBest(matchKey='bestImage', measureKey='timeDiff')

# Apply the join.
landsat_met = save_best_join.apply(primary, gridmet, max_diff_filter)

# Print the result.
display(landsat_met)
# [END earthengine__joins06__save_best]

# check the dates (both UTC)
first_left_match = ee.Image(landsat_met.first())
first_right_match = ee.Image(first_left_match.get('bestImage'))
display(ee.Date(first_left_match.get('system:time_start')))
display(ee.Date(first_right_match.get('system:time_start')))
