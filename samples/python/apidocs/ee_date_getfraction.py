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

# [START earthengine__apidocs__ee_date_getfraction]
date = ee.Date('2021-4-30T07:15:31.24')

display('Elapsed fraction of a year:', date.getFraction('year'))
display('Elapsed fraction of a month:', date.getFraction('month'))
display('Elapsed fraction of a week:', date.getFraction('week'))
display('Elapsed fraction of a day:', date.getFraction('day'))
display('Elapsed fraction of an hour:', date.getFraction('hour'))
display('Elapsed fraction of a minute:', date.getFraction('minute'))
display('Elapsed fraction of a second:', date.getFraction('second'))
# [END earthengine__apidocs__ee_date_getfraction]
