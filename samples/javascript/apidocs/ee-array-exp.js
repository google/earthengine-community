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

// [START earthengine__apidocs__ee_array_exp]
var empty = ee.Array([], ee.PixelType.int8());
print(empty.exp());  // []

// [Math.pow(Math.E, -1), 1, Math.E, 7.389]
print(ee.Array([-1, 0, 1, 2]).exp());

var start = -5;
var end = 2;
var points = ee.Array(ee.List.sequence(start, end, null, 50));
var values = points.exp();

// Plot exp() defined above.
var chart = ui.Chart.array.values(values, 0, points)
    .setOptions({
      viewWindow: {min: start, max: end},
      hAxis: {
        title: 'x',
        viewWindowMode: 'maximized',
      },
      vAxis: {
        title: 'exp(x)',
      },
      lineWidth: 1,
      pointSize: 0,
    });
print(chart);
// [END earthengine__apidocs__ee_array_exp]
