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

# [START earthengine__apidocs__ee_daterange_intersects]
# A series of ee.DateRange objects.
date_range_1 = ee.DateRange('2017-06-24', '2017-07-24')
date_range_2 = ee.DateRange('2017-06-30', '2018-07-10')
date_range_3 = ee.DateRange('1970-06-24', '1971-07-24')
date_range_4 = ee.DateRange('2017-06-25', '2017-07-25')

# Determine if an ee.DateRange intersects another.
display(
    'Does date_range_1 contain date_range_2?',
    date_range_1.intersects(date_range_2)
)
display(
    'Does date_range_1 contain date_range_3?',
    date_range_1.intersects(date_range_3)
)
display(
    'Does date_range_1 contain date_range_4?',
    date_range_1.intersects(date_range_4)
)
# [END earthengine__apidocs__ee_daterange_intersects]
