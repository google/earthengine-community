/**
 * Copyright 2020 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Earth Engine Developer's Guide examples from Tutorial 1 - API.
 */

// PAGE: Functional Programming Concepts

// [START earthengine__tutorial_1_functional__square_a_list]
// This generates a list of numbers from 1 to 10.
var myList = ee.List.sequence(1, 10);

// The map() operation takes a function that works on each element independently
// and returns a value. You define a function that can be applied to the input.
var computeSquares = function(number) {
  // We define the operation using the EE API.
  return ee.Number(number).pow(2);
};

// Apply your function to each item in the list by using the map() function.
var squares = myList.map(computeSquares);
print(squares);  // [1, 4, 9, 16, 25, 36, 49, 64, 81]
// [END earthengine__tutorial_1_functional__square_a_list]

// [START earthengine__tutorial_1_functional__square_odd_numbers]
// The following function determines if a number is even or odd.  The mod(2)
// function returns 0 if the number is even and 1 if it is odd (the remainder
// after dividing by 2).  The input is multiplied by this remainder so even
// numbers get set to 0 and odd numbers are left unchanged.
var getOddNumbers = function(number) {
  number = ee.Number(number);   // Cast the input to a Number so we can use mod.
  var remainder = number.mod(2);
  return number.multiply(remainder);
};

var newList = myList.map(getOddNumbers);

// Remove the 0 values.
var oddNumbers = newList.removeAll([0]);

var squares = oddNumbers.map(computeSquares);
print(squares);  // [1, 9, 25, 49, 81]
// [END earthengine__tutorial_1_functional__square_odd_numbers]

// [START earthengine__tutorial_1_functional__filter_collections]
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');

// Divide the collection into 2 subsets and apply a different algorithm on them.
var subset1 = collection.filter(ee.Filter.lt('SUN_ELEVATION', 40));
var subset2 = collection.filter(ee.Filter.gte('SUN_ELEVATION', 40));

var processed1 = subset1.map(function(image) {
  return image.multiply(2);
});
var processed2 = subset2;

// Merge the collections to get a single collection.
var final = processed1.merge(processed2);
print('Original collection size', collection.size());
print('Processed collection size', final.size());
// [END earthengine__tutorial_1_functional__filter_collections]


// [START earthengine__tutorial_1_functional__fibonacci_sequence]
var algorithm = function(current, previous) {
  previous = ee.List(previous);
  var n1 = ee.Number(previous.get(-1));
  var n2 = ee.Number(previous.get(-2));
  return previous.add(n1.add(n2));
};

// Compute 10 iterations.
var numIteration = ee.List.repeat(1, 10);
var start = [0, 1];
var sequence = numIteration.iterate(algorithm, start);
print(sequence);  // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

// [END earthengine__tutorial_1_functional__fibonacci_sequence]
