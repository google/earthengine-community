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

// [START earthengine__apidocs__ee_array_erfc]
print(ee.Array([-6]).erfc());  // [2]
print(ee.Array([0]).erfc());  // [1]
print(ee.Array([28]).erfc());  // [0]

var start = -3;
var end = 3;
var points = ee.Array(ee.List.sequence(start, end, null, 50));
var values = points.erfc();

// Plot erfc() defined above.
var chart = ui.Chart.array.values(values, 0, points)
    .setOptions({
      viewWindow: {min: start, max: end},
      hAxis: {
        title: 'x',
        viewWindowMode: 'maximized',
        ticks: [
          {v: start},
          {v: 0},
          {v: end}]
      },
      vAxis: {
        title: 'erfc(x)',
        ticks: [
          {v: 0},
          {v: 1},
          {v: 2}]
      },
      lineWidth: 1,
      pointSize: 0,
    });
print(chart);
// [END earthengine__apidocs__ee_array_erfc]
