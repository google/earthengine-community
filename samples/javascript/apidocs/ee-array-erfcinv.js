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

// [START earthengine__apidocs__ee_array_erfcinv]
print(ee.Array([0.1]).erfcInv());  // [1.163]
print(ee.Array([1]).erfcInv());  // [0]
print(ee.Array([1.9]).erfcInv());  // [-1.163]

var start = 0.001;
var end = 1.999;
var points = ee.Array(ee.List.sequence(start, end, null, 50));
var values = points.erfcInv();

// Plot erfcInv() defined above.
var chart = ui.Chart.array.values(values, 0, points)
    .setOptions({
      viewWindow: {min: start, max: end},
      hAxis: {
        title: 'x',
        viewWindowMode: 'maximized',
        ticks: [
          {v: 0},
          {v: 1},
          {v: 2}]
      },
      vAxis: {
        title: 'erfcInv(x)',
        ticks: [
          {v: -3},
          {v: 0},
          {v: 3}]
      },
      lineWidth: 1,
      pointSize: 0,
    });
print(chart);
// [END earthengine__apidocs__ee_array_erfcinv]
