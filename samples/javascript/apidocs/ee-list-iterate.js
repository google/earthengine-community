/**
 * Copyright 2022 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_list_iterate]
// This example uses the ee.List.iterate function to generate a series of
// sequentially halved values.

// Declare a list that will hold the series of sequentially halved values,
// initialize it with the starting quantity.
var quantityList = [1000];

// Define the number of iterations as a list sequence.
var nSteps = ee.List.sequence(1, 10);

// Declare a function that takes the current element of the iteration list and
// the returned result of the previous iteration as inputs. In this case, the
// the function is returning an accumulating list of quantities that are reduced
// by half at each iteration.
var halfOfPrevious = function(currentElement, previousResult) {
  var previousQuantity = ee.Number(ee.List(previousResult).get(-1));
  var currentQuantity = previousQuantity.divide(2);
  return ee.List(previousResult).add(currentQuantity);
};

// Apply the function to the nSteps list, each element is an iteration.
quantityList = ee.List(nSteps.iterate(halfOfPrevious, quantityList));

// Display the results. Note that step 0 is included for the initial value.
print('Steps in the iteration of halved quantities', nSteps);
print('Series of sequentially halved quantities', quantityList);
print(ui.Chart.array.values({
  array: quantityList,
  axis: 0,
  xLabels: ee.List([0]).cat(nSteps)
}));
// [END earthengine__apidocs__ee_list_iterate]
