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

# [START earthengine__joins07__spatial_save_all]
# Load a primary collection: protected areas (Yosemite National Park).
primary = ee.FeatureCollection('WCMC/WDPA/current/polygons').filter(
    ee.Filter.eq('NAME', 'Yosemite National Park')
)

# Load a secondary collection: power plants.
power_plants = ee.FeatureCollection('WRI/GPPD/power_plants')

# Define a spatial filter, with distance 100 km.
dist_filter = ee.Filter.withinDistance(
    distance=100000, leftField='.geo', rightField='.geo', maxError=10
)

# Define a saveAll join.
dist_save_all = ee.Join.saveAll(matchesKey='points', measureKey='distance')

# Apply the join.
spatial_joined = dist_save_all.apply(primary, power_plants, dist_filter)

# Print the result.
display(spatial_joined)
# [END earthengine__joins07__spatial_save_all]
