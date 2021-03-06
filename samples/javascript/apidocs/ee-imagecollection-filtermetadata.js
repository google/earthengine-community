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

// [START earthengine__apidocs__ee_imagecollection_filtermetadata]
// Filtering an ImageCollection by metadata.

var dataset = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterDate('2020-01-01', '2020-01-02');
var filtered = dataset.filterMetadata(
    'CLOUDY_PIXEL_PERCENTAGE', 'less_than', 0.2);

print(dataset.size());   // 7156
print(filtered.size());  // 391

// ee.ImageCollection.filter is equiavalent.
var filtered2 = dataset.filter('CLOUDY_PIXEL_PERCENTAGE < 0.2');
print(filtered2.size());  // 391
// [END earthengine__apidocs__ee_imagecollection_filtermetadata]
