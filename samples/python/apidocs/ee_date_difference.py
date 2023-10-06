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

# [START earthengine__apidocs__ee_date_difference]
DATE_1 = ee.Date('2020-01-01')
DATE_2 = ee.Date('2020-01-15')

# Format the dates as strings.
t1 = DATE_1.format('YYYY-MM-DD').getInfo()
t2 = DATE_2.format('YYYY-MM-DD').getInfo()

# Calculate the differences between dates.
diff_1 = DATE_2.difference(DATE_1, 'days').getInfo()
diff_2 = DATE_1.difference(DATE_2, 'weeks').getInfo()

print(f'The difference between {t2} relative to {t1} is {diff_1} days.')
print(f'The difference between {t1} relative to {t2} is {diff_2} weeks.')
# [END earthengine__apidocs__ee_date_difference]
