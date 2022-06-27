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

// [START earthengine__apidocs__ee_imagecollection_merge]
// Sentinel-2 surface reflectance image collection.
var ic = ee.ImageCollection('COPERNICUS/S2_SR');

// Filter the images to those that intersect Mount Shasta for 3 months
// in 2019 and 2021 (two image collections).
var geom = ee.Geometry.Point(-122.196, 41.411);
var ic2018 = ic.filterBounds(geom).filterDate('2019-07-01', '2019-10-01');
print('2018 image collection', ic2018);
var ic2021 = ic.filterBounds(geom).filterDate('2021-07-01', '2021-10-01');
print('2021 image collection', ic2021);

// Merge the two image collections.
var icMerged = ic2018.merge(ic2021);
print('Merged image collection', icMerged);
// [END earthengine__apidocs__ee_imagecollection_merge]
