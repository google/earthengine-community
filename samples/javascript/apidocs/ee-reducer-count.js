/**
 * Copyright 2026 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_reducer_count]
print(ee.List([]).reduce(ee.Reducer.count()));  // 0
print(ee.List([0]).reduce(ee.Reducer.count()));  // 1
print(ee.List([-1]).reduce(ee.Reducer.count()));  // 1
print(ee.List([1, null, 3]).reduce(ee.Reducer.count()));  // 2
print(ee.List([1, '', 3]).reduce(ee.Reducer.count()));  // 3

print(ee.Array([1, 0, 3]).reduce(ee.Reducer.count(), [0]));  // [3]

var anArray = ee.Array([[1, 0, 3], [1, 2, 3]]);
print(anArray.reduce(ee.Reducer.count(), [0]));  // [[2, 2, 2]]
print(anArray.reduce(ee.Reducer.count(), [1]));  // [[3], [3]]
print(anArray.reduce(ee.Reducer.count(), [1, 0]));  // [[6]]

// Use reduceRegion to apply count().
var elev = ee.Image('CGIAR/SRTM90_V4');
var roi = ee.Geometry.Point([-119.86, 37.74]).buffer(5000);

// Create a mask where elevation is greater than 2000 meters.
var highElevMask = elev.gt(2000);

// Update the image with the mask. Pixels = 0 in the mask become null/masked.
var maskedElev = elev.updateMask(highElevMask);

// Run the count reducer. Masked pixels are ignored.
var highElevCount = maskedElev.reduceRegion({
  reducer: ee.Reducer.count(),
  geometry: roi,
  scale: 90,
  maxPixels: 1e9
});

print('Count of pixels > 2000m:', highElevCount.get('elevation'));  // 20
// [END earthengine__apidocs__ee_reducer_count]
