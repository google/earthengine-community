# Copyright 2023 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START earthengine__apidocs__ee_imagecollection_aggregate_mean]
from pprint import pprint

# A Lansat 8 TOA image collection for a specific year and location.
col = ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA").filterBounds(
    ee.Geometry.Point([-122.073, 37.188])).filterDate('2018', '2019')

# An image property of interest, percent cloud cover in this case.
prop = 'CLOUD_COVER'

# Use ee.ImageCollection.aggregate_* functions to fetch information about
# values of a selected property across all images in the collection. For
# example, produce a list of all values, get counts, and calculate statistics.
print('List of property values:', col.aggregate_array(prop).getInfo())
print('Count of property values:', col.aggregate_count(prop).getInfo())
print('Count of distinct property values:',
      col.aggregate_count_distinct(prop).getInfo())
print('First collection element property value:',
      col.aggregate_first(prop).getInfo())
print('Histogram of property values:')
pprint(col.aggregate_histogram(prop).getInfo())
print('Min of property values:', col.aggregate_min(prop).getInfo())
print('Max of property values:', col.aggregate_max(prop).getInfo())

# The following methods are applicable to numerical properties only.
print('Mean of property values:', col.aggregate_mean(prop).getInfo())
print('Sum of property values:', col.aggregate_sum(prop).getInfo())
print('Product of property values:', col.aggregate_product(prop).getInfo())
print('Std dev (sample) of property values:',
      col.aggregate_sample_sd(prop).getInfo())
print('Variance (sample) of property values:',
      col.aggregate_sample_var(prop).getInfo())
print('Std dev (total) of property values:',
      col.aggregate_total_sd(prop).getInfo())
print('Variance (total) of property values:',
      col.aggregate_total_var(prop).getInfo())
print('Summary stats of property values:')
pprint(col.aggregate_stats(prop).getInfo())

# Note that if the property is formatted as a string, min and max will
# respectively return the first and last values according to alphanumeric
# order of the property values.
prop_string = 'LANDSAT_SCENE_ID'
print('List of property values (string):',
      col.aggregate_array(prop_string).getInfo())
print('Min of property values (string):',
      col.aggregate_min(prop_string).getInfo())
print('Max of property values (string):',
      col.aggregate_max(prop_string).getInfo())
# [END earthengine__apidocs__ee_imagecollection_aggregate_mean]
