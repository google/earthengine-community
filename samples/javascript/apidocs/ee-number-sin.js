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

// [START earthengine__apidocs__ee_number_sin]
// Examples using the sin() math function.
print(ee.Number(-Math.PI).sin());  // Almost 0.0
print(ee.Number(0).sin());  // 0
print(ee.Number(Math.PI / 2.0).sin());  // 1
print(ee.Number(Math.PI).sin());  // Almost 0.0

// Define a sequence from -2pi to +2pi in 50 increments.
var start = -2 * Math.PI;
var end = 2 * Math.PI;
var points = ee.List.sequence(start, end, null, 50);

// Evaluate the sin() function for each value in the `points` sequence.
var values = points.map(function(val) {
  return ee.Number(val).sin();
});

// Evaluate and plot the equations defined above.
var chart = ui.Chart.array.values(values, 0, points)
    .setOptions({
      viewWindow: {min: start, max: end},
      hAxis: {
        title: 'radians',
        viewWindowMode: 'maximized',
        ticks: [
          {v: start, f: '-2π'},
          {v: -Math.PI, f: '-π'},
          {v: 0, f: '0'},
          {v: Math.PI, f: 'π'},
          {v: end, f: '2π'}]
      },
      vAxis: {title: 'sin(x)'},
      lineWidth: 1,
      pointSize: 3,
    });
print(chart);
// [END earthengine__apidocs__ee_number_sin]
