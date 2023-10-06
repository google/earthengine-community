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

# [START earthengine__apidocs__ee_date_unitratio]
display('Minutes in a day:', ee.Date.unitRatio('day', 'minute'))
display('Seconds in a year:', ee.Date.unitRatio('year', 'second'))
display('Years in a month:', ee.Date.unitRatio('month', 'year'))
display('Hours in a week:', ee.Date.unitRatio('week', 'hour'))
# [END earthengine__apidocs__ee_date_unitratio]
