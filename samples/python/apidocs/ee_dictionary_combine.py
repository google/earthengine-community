# Copyright 2021 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_dictionary_combine]
import pprint

# A dictionary (e.g. results of ee.Image.reduceRegion of an S2 image).
dic_1 = ee.Dictionary({
    'B1': 182,
    'B2': 219,
    'B3': 443
})

# A second dictionary.
dic_2 = ee.Dictionary({
    'Region': 'The Forest of Nisene Marks State Park',
    'Image': 'Sentinel-2 surface reflectance (scaled by 1e4)',
    'B1': -9999  # Note that the B1 key is present in both dictionaries.
})

print('Combined dictionaries (overwrite false)')
pprint.pprint(dic_1.combine(dic_2, False).getInfo())

print('\nCombined dictionaries (overwrite true)')
pprint.pprint(dic_1.combine(dic_2, True).getInfo())
# [END earthengine__apidocs__ee_dictionary_combine]
