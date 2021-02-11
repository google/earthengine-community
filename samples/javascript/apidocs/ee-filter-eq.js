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

// [START earthengine__apidocs__ee_filter_eq]
// The GOES Mesoscale images come in two domains.
// Separate the two groups using ee.Filter.eq.
var goes17_mcmipm = ee.ImageCollection('NOAA/GOES/17/MCMIPM');
var goes17_mcmipm_2019 =
    goes17_mcmipm.filterDate(ee.Date('2019-11'), ee.Date('2019-12'));

var d1 = goes17_mcmipm_2019.filter(ee.Filter.eq('domain', 1));
var d2 = goes17_mcmipm_2019.filter(ee.Filter.eq('domain', 2));
print(goes17_mcmipm_2019.size());  // 55509
print(d1.size());                  // 27842
print(d2.size());                  // 27667
// [END earthengine__apidocs__ee_filter_eq]
