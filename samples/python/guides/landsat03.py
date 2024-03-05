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

"""Earth Engine Developer's Guide examples from 'Landsat Algorithms - Simple Composite' section."""

# [START earthengine__landsat03__simple_composite]
# Load a raw Landsat 5 ImageCollection for a single year.
collection = ee.ImageCollection('LANDSAT/LT05/C02/T1').filterDate(
    '2010-01-01', '2010-12-31'
)

# Create a cloud-free composite with default parameters.
composite = ee.Algorithms.Landsat.simpleComposite(collection)

# Create a cloud-free composite with custom parameters for
# cloud score threshold and percentile.
custom_composite = ee.Algorithms.Landsat.simpleComposite(
    collection=collection, percentile=75, cloudScoreRange=5
)

# Display the composites.
m = geemap.Map()
m.set_center(-122.3578, 37.7726, 10)
m.add_layer(
    composite, {'bands': ['B4', 'B3', 'B2'], 'max': 128}, 'TOA composite'
)
m.add_layer(
    custom_composite,
    {'bands': ['B4', 'B3', 'B2'], 'max': 128},
    'Custom TOA composite',
)
m
# [END earthengine__landsat03__simple_composite]
