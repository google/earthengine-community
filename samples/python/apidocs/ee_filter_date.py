# Copyright 2023 The Google Earth Engine Community Authors
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

# [START earthengine__apidocs__ee_filter_date]
# collection.filterDate is preferred.
# Constructed FeatureCollection representing a field site sampled at
# four different dates.
geom = ee.Geometry.Point([-119.56, 37.67])
fc = ee.FeatureCollection([
    ee.Feature(geom, {'prop': 10, 'system:time_start': ee.Date('2021-06-10')}),
    ee.Feature(geom, {'prop': 11, 'system:time_start': ee.Date('2021-06-20')}),
    ee.Feature(geom, {'prop': 19, 'system:time_start': ee.Date('2021-07-10')}),
    ee.Feature(geom, {'prop': 10, 'system:time_start': ee.Date('2021-07-20')})
])

# Filter the observations in July 2021.
display('Field site observations collection in July 2021:',
        fc.filter(ee.Filter.date('2021-07-01', '2021-08-01')))

# Alternative input formats.
date_range = ee.DateRange('2021-07-01', '2021-08-01')
display(fc.filter(ee.Filter.date(date_range)))

display('Numbers (milliseconds since Unix epoch) as an input:',
        fc.filter(ee.Filter.date(1625875200000, 1626739200001)))

display('ee.Date objects as an input:',
    fc.filter(
        ee.Filter.date(ee.Date('2021-07-01'), ee.Date('2021-08-01'))
    )
)
# [END earthengine__apidocs__ee_filter_date]
