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
 *   from the 'Code Editor' Script Modules section.
 */

// [START earthengine__modules__exports]
exports.doc = 'The Foo module is a demonstration of script modules.' +
    '\n It contains a foo function that returns a greeting string. ' +
    '\n It also contains a bar object representing the current date.' +
    '\n' +
    '\n foo(arg):' +
    '\n   @param {ee.String} arg The name to which the greeting should be addressed' +
    '\n   @return {ee.String} The complete greeting.' +
    '\n' +
    '\n bar:' +
    '\n   An ee.Date object containing the time at which the object was created.';

exports.foo = function(arg) {
  return 'Hello, ' + arg + '!  And a good day to you!';
};

exports.bar = ee.Date(Date.now());
// [END earthengine__modules__exports]


// [START earthengine__modules__require]
var Foo = require('users/username/default:Modules/FooModule.js');

print(Foo.doc);

print(Foo.foo('world'));

print('Time now:', Foo.bar);
// [END earthengine__modules__require]
