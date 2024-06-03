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


#  Earth Engine Developer's Guide examples
#   from 'Reducers - ImageCollection reduce' section.

# [START earthengine__reducers01__ic_median]
# Load an image collection, filtered so it's not too much data.
collection = (
    ee.ImageCollection('LANDSAT/LT05/C02/T1')
    .filterDate('2008-01-01', '2008-12-31')
    .filter(ee.Filter.eq('WRS_PATH', 44))
    .filter(ee.Filter.eq('WRS_ROW', 34))
)

# Compute the median in each band, each pixel.
# Band names are B1_median, B2_median, etc.
median = collection.reduce(ee.Reducer.median())

# The output is an Image.  Add it to the map.
vis_param = {'bands': ['B4_median', 'B3_median', 'B2_median'], 'gamma': 1.6}
m = geemap.Map()
m.set_center(-122.3355, 37.7924, 9)
m.add_layer(median, vis_param)
m
# [END earthengine__reducers01__ic_median]
