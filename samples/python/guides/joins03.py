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

"""Earth Engine Developer's Guide examples from 'Joins - Inner toy example' section."""

# [START earthengine__joins03__toy_inner]
# Create the primary collection.
primary_features = ee.FeatureCollection([
    ee.Feature(None, {'foo': 0, 'label': 'a'}),
    ee.Feature(None, {'foo': 1, 'label': 'b'}),
    ee.Feature(None, {'foo': 1, 'label': 'c'}),
    ee.Feature(None, {'foo': 2, 'label': 'd'}),
])

# Create the secondary collection.
secondary_features = ee.FeatureCollection([
    ee.Feature(None, {'bar': 1, 'label': 'e'}),
    ee.Feature(None, {'bar': 1, 'label': 'f'}),
    ee.Feature(None, {'bar': 2, 'label': 'g'}),
    ee.Feature(None, {'bar': 3, 'label': 'h'}),
])

# Use an equals filter to specify how the collections match.
toy_filter = ee.Filter.equals(leftField='foo', rightField='bar')

# Define the join.
inner_join = ee.Join.inner('primary', 'secondary')

# Apply the join.
toy_join = inner_join.apply(primary_features, secondary_features, toy_filter)

# Print the result.
display('Inner join toy example:', toy_join)
# [END earthengine__joins03__toy_inner]
