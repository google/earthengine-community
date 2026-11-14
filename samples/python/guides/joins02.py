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

"""Earth Engine Developer's Guide examples from 'Joins - Inverted' section."""

# [START earthengine__joins02__inverted_join]
# Load a Landsat 8 image collection at a point of interest.
collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA').filterBounds(
    ee.Geometry.Point(-122.09, 37.42)
)

# Define start and end dates with which to filter the collections.
april = '2014-04-01'
may = '2014-05-01'
june = '2014-06-01'
july = '2014-07-01'

# The primary collection is Landsat images from April to June.
primary = collection.filterDate(april, june)

# The secondary collection is Landsat images from May to July.
secondary = collection.filterDate(may, july)

# Use an equals filter to define how the collections match.
filter = ee.Filter.equals(leftField='system:index', rightField='system:index')

# [START earthengine__joins02__inverted]
# Define the join.
inverted_join = ee.Join.inverted()

# Apply the join.
inverted_joined = inverted_join.apply(primary, secondary, filter)
# [END earthengine__joins02__inverted]

# Print the result.
display('Inverted join:', inverted_joined)
# [END earthengine__joins02__inverted_join]
