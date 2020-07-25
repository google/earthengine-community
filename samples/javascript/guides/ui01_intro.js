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
 *   from 'Earth Engine User Interface' intro section
 */

// [START earthengine__ui01_intro__hello_knobs]
// Make a button widget.
var button = ui.Button('Click me!');

// Set a callback function to run when the
// button is clicked.
button.onClick(function() {
  print('Hello, world!');
});

// Display the button in the console.
print(button);
// [END earthengine__ui01_intro__hello_knobs]

// [START earthengine__ui01_intro__mutable]
// Set another callback function on the button.
button.onClick(function() {
  print('Oh, yeah!');
});
// [END earthengine__ui01_intro__mutable]
