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

"""Earth Engine Developer's Guide examples from 'Filtering Image Collections' page."""

# [START earthengine__image_collections03__filtering]
# Load Landsat 8 data, filter by date, month, and bounds.
collection = (
    ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    # Three years of data
    .filterDate('2015-01-01', '2018-01-01')
    # Only Nov-Feb observations
    .filter(ee.Filter.calendarRange(11, 2, 'month'))
    # Intersecting ROI
    .filterBounds(ee.Geometry.Point(25.8544, -18.08874))
)

# Also filter the collection by the CLOUD_COVER property.
filtered = collection.filter(ee.Filter.eq('CLOUD_COVER', 0))

# Create two composites to check the effect of filtering by CLOUD_COVER.
bad_composite = collection.mean()
good_composite = filtered.mean()

# Display the composites.
m = geemap.Map()
m.set_center(25.8544, -18.08874, 13)
m.add_layer(
    bad_composite,
    {'bands': ['B3', 'B2', 'B1'], 'min': 0.05, 'max': 0.35, 'gamma': 1.1},
    'Bad composite',
)
m.add_layer(
    good_composite,
    {'bands': ['B3', 'B2', 'B1'], 'min': 0.05, 'max': 0.35, 'gamma': 1.1},
    'Good composite',
)
m
# [END earthengine__image_collections03__filtering]
