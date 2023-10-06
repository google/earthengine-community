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

# [START earthengine__apidocs__ee_date_getrelative]
date = ee.Date('2021-4-30T07:15:31.24')

display('0-based month of year:', date.getRelative('year', 'year'))
display('0-based week of year:', date.getRelative('week', 'year'))
display('0-based day of year:', date.getRelative('day', 'year'))
display('0-based day of month:', date.getRelative('day', 'month'))
display('0-based minute of day:', date.getRelative('minute', 'day'))
display('0-based second of minute:', date.getRelative('second', 'minute'))

# 0 is returned when unit argument is larger than inUnit argument.
display('0-based year of month (bad form):', date.getRelative('year', 'month'))
# [END earthengine__apidocs__ee_date_getrelative]
