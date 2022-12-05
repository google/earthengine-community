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

# [START earthengine__apidocs__ee_date_get]
date = ee.Date('2021-4-30T07:15:31')

print('Year:', date.get('year').getInfo())
print('Month:', date.get('month').getInfo())
print('Week:', date.get('week').getInfo())
print('Day:', date.get('day').getInfo())
print('Hour:', date.get('hour').getInfo())
print('Minute:', date.get('minute').getInfo())
print('Second:', date.get('second').getInfo())
# [END earthengine__apidocs__ee_date_get]
