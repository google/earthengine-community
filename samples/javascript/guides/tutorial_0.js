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
 * @fileoverview Earth Engine Developer's Guide examples
 *   from Tutorial 0.
 */

// [START earthengine__tutorial_0__hello]
print('Hello World!');
// [END earthengine__tutorial_0__hello]

// [START earthengine__tutorial_0__comment]
// print('Hello World!');
// [END earthengine__tutorial_0__comment]

// [START earthengine__tutorial_0__string]
// Use single (or double) quotes to make a string.
var greetString = 'Ahoy there!';
// Use parentheses to pass arguments to functions.
print(greetString);
// [END earthengine__tutorial_0__string]

// [START earthengine__tutorial_0__number]
// Store a number in a variable.
var number = 42;
print('The answer is:', number);
// [END earthengine__tutorial_0__number]

// [START earthengine__tutorial_0__list1]
// Use square brackets [] to make a list.
var listOfNumbers = [0, 1, 1, 2, 3, 5];
print('List of numbers:', listOfNumbers);
// [END earthengine__tutorial_0__list1]

// [START earthengine__tutorial_0__list2]
// Make a list of strings.
var listOfStrings = ['a', 'b', 'c', 'd'];
print('List of strings:', listOfStrings);
// [END earthengine__tutorial_0__list2]

// [START earthengine__tutorial_0__object]
// Use curly brackets {} to make a dictionary of key:value pairs.
var object = {
  foo: 'bar',
  baz: 13,
  stuff: ['this', 'that', 'the other thing']
};
print('Dictionary:', object);
// Access dictionary items using square brackets.
print('Print foo:', object['foo']);
// Access dictionary items using dot notation.
print('Print stuff:', object.stuff);
// [END earthengine__tutorial_0__object]

// [START earthengine__tutorial_0__function]
var myFunction = function(parameter1, parameter2, parameter3) {
  statement;
  statement;
  statement;
  return statement;
};
// [END earthengine__tutorial_0__function]

// [START earthengine__tutorial_0__reflect]
// The reflect function takes a single parameter: element.
var reflect = function(element) {
  // Return the argument.
  return element;
};
print('A good day to you!', reflect('Back at you!'));
// [END earthengine__tutorial_0__reflect]

// [START earthengine__tutorial_0__ee_function]
var aString = ee.Algorithms.String(42);
// [END earthengine__tutorial_0__ee_function]

/************************/
/* EE content           */
/************************/
// [START earthengine__tutorial_0__ee_string]
// Define a string, then put it into an EE container.
var aString = 'To the cloud!';
var eeString = ee.String(aString);
print('Where to?', eeString);
// [END earthengine__tutorial_0__ee_string]

// [START earthengine__tutorial_0__server_string]
// Define a string that exists on the server.
var serverString = ee.String('This is on the server.');
print('String on the server:', serverString);
// [END earthengine__tutorial_0__server_string]

// [START earthengine__tutorial_0__server_number]
// Define a number that exists on the server.
var serverNumber = ee.Number(Math.E);
print('e=', serverNumber);
// [END earthengine__tutorial_0__server_number]

// [START earthengine__tutorial_0__server_operation]
// Use a built-in function to perform an operation on the number.
var logE = serverNumber.log();
print('log(e)=', logE);
// [END earthengine__tutorial_0__server_operation]

// [START earthengine__tutorial_0__server_list]
// Make a sequence the hard way.
var eeList = ee.List([1, 2, 3, 4, 5]);
// Make a sequence the easy way!
var sequence = ee.List.sequence(1, 5);
print('Sequence:', sequence);
// [END earthengine__tutorial_0__server_list]

// [START earthengine__tutorial_0__server_method]
// Use a method on an ee.List to extract a value.
var value = sequence.get(2);
print('Value at index 2:', value);
// [END earthengine__tutorial_0__server_method]

// [START earthengine__tutorial_0__cast]
// Cast the return value of get() to a number.
print('No error:', ee.Number(value).add(3));
// [END earthengine__tutorial_0__cast]

// [START earthengine__tutorial_0__server_object]
// Make a Dictionary on the server.
var dictionary = ee.Dictionary({
  e: Math.E,
  pi: Math.PI,
  phi: (1 + Math.sqrt(5)) / 2
});

// Get some values from the dictionary.
print('Euler:', dictionary.get('e'));
print('Pi:', dictionary.get('pi'));
print('Golden ratio:', dictionary.get('phi'));

// Get all the keys:
print('Keys: ', dictionary.keys());
// [END earthengine__tutorial_0__server_object]

// [START earthengine__tutorial_0__date]
// Define a date in Earth Engine.
var date = ee.Date('2015-12-31');
print('Date:', date);

// Get the current time using the JavaScript Date.now() method.
var now = Date.now();
print('Milliseconds since January 1, 1970', now);

// Initialize an ee.Date object.
var eeNow = ee.Date(now);
print('Now:', eeNow);
// [END earthengine__tutorial_0__date]

// [START earthengine__tutorial_0__ordered_parameters]
var aDate = ee.Date.fromYMD(2017, 1, 13);
print('aDate:', aDate);
// [END earthengine__tutorial_0__ordered_parameters]

// [START earthengine__tutorial_0__named_parameters]
var theDate = ee.Date.fromYMD({
  day: 13,
  month: 1,
  year: 2017
});
print('theDate:', theDate);
// [END earthengine__tutorial_0__named_parameters]
