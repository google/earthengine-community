/**
 * Copyright 2021 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START earthengine__apidocs__ee_imagecollection_filter]
// The GOES Mesoscale images come in two domains.
// Separate the two groups using ee.Filter.eq.
var goes17_mcmipm = ee.ImageCollection('NOAA/GOES/17/MCMIPM');
var goes17_mcmipm_day =
    goes17_mcmipm.filterDate('2020-09-26', '2020-09-27');

var d1 = goes17_mcmipm_day.filter('domain == 1');
var d2 = goes17_mcmipm_day.filter('domain == 2');
// domain 3 does not exist.
var d3 = goes17_mcmipm_day.filter('domain == 3');

print(goes17_mcmipm_day.size());  // 2880
print(d1.size());                 // 1440
print(d2.size());                 // 1440
print(d3.size());                 // 0
// [END earthengine__apidocs__ee_imagecollection_filter]
