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

# [START earthengine__apidocs__ee_daterange]
print('String date inputs (interpreted as UTC by default):',
      ee.DateRange('2017-06-24', '2017-07-24').getInfo())

print('String date inputs with timeZone argument:',
      ee.DateRange('2017-06-24', '2017-07-24', 'America/Los_Angeles').getInfo())

print('String date-time inputs with timeZone argument:',
      ee.DateRange('2017-06-24T07:00:00', '2017-07-24T07:00:00',
                   'America/Los_Angeles').getInfo())

print('A single date input results in a 1-millisecond range:',
      ee.DateRange('2017-06-24').getInfo())

print('ee.Date inputs',
      ee.DateRange(ee.Date('2017-06-24'), ee.Date('2017-07-24')).getInfo())

print('ee.Date date-time inputs (UTC by default):',
      ee.DateRange(ee.Date('2017-06-24T07:00:00'),
                   ee.Date('2017-07-24T07:00:00')).getInfo())

print('ee.Date date-time inputs with timeZone arguments:',
      ee.DateRange(ee.Date('2017-06-24T07:00:00', 'UTC'),
                   ee.Date('2017-07-24T07:00:00',
                           'America/Los_Angeles')).getInfo())

print('Number inputs as milliseconds from Unix epoch (2017-06-24, 2017-07-24):',
      ee.DateRange(1498262400000, 1500854400000).getInfo())
# [END earthengine__apidocs__ee_daterange]
