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

# [START earthengine__apidocs__ee_date_getrange]
date = ee.Date('2021-4-30T07:15:31.24')

display('1-year date range covering input date:', date.getRange('year'))
display('1-month date range covering input date:', date.getRange('month'))
display('1-week date range covering input date:', date.getRange('week'))
display('1-day date range covering input date:', date.getRange('day'))
display('1-hour date range covering input date:', date.getRange('hour'))
display('1-minute date range covering input date:', date.getRange('minute'))
display('1-second date range covering input date:', date.getRange('second'))
# [END earthengine__apidocs__ee_date_getrange]
