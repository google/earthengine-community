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

// [START earthengine__apidocs__ee_array_mod]
var empty = ee.Array([], ee.PixelType.int8());
print(empty.mod(empty));  // []

print(ee.Array([0, 0]).mod(ee.Array([-1, 2])));  // [0,0]
print(ee.Array([0, 1, 2, 3, 4]).mod(ee.Array([1, 1, 1, 1, 1])));  // [0,0,0,0,0]
print(ee.Array([0, 1, 2, 3, 4]).mod(ee.Array([2, 2, 2, 2, 2])));  // [0,1,0,1,0]
print(ee.Array([0, 1, 7, 8, 9]).mod(ee.Array([8, 8, 8, 8, 8])));  // [0,1,7,0,1]
print(ee.Array([-1, -7, -8, -9]).mod(ee.Array([8, 8, 8, 8])));  // [-1,-7,0,-1]

print(ee.Array([8, 8, 8, 8]).mod(ee.Array([-1, -7, -8, -9])));  // [0,1,0,8]

print(ee.Array([2.5]).mod(ee.Array([1.2])));  // [0.10000000000000009]

// Generate a square wave graph using mod.
var start = -10;
var end = 10;
var numElements = 1000;
var stepSize = 2;

var points = ee.Array(ee.List.sequence(start, end, null, numElements));
var modValues = ee.Array([stepSize]).repeat(0, numElements);
var values = points.mod(modValues).floor();

// Plot mod().floor() defined above.
// Generate a square wave that is different for negative and positive values.
var chart = ui.Chart.array.values(values, 0, points)
    .setOptions({
      viewWindow: {min: start, max: end},
      hAxis: {
        title: 'x',
        viewWindowMode: 'maximized'
      },
      vAxis: {
        title: 'mod().floor()',
        ticks: [{v: -3}, {v: -2}, {v: -1}, {v: 0}, {v: 1}, {v: 2}]
      },
      lineWidth: 1,
      pointSize: 0,
    });
print(chart);
// [END earthengine__apidocs__ee_array_mod]
