/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var NamedArgs = require('../../impl/named-args').NamedArgs;

// Test function acts as a thin wrapper, returning exactly what is returned
// by extractFromFunction for testing.
var testFunction = function(foo, bar, baz) {
  return NamedArgs.extractFromFunction(testFunction, arguments);
};

withEarthEngineStub('NamedArgs', function() {
  it('extractFromFunction() builds dictionary', function() {
    var actual = testFunction(3, 141, 59);
    var expected = {foo: 3, bar: 141, baz: 59};
    expect(actual).toEqual(expected);
  });

  it('extractFromFunction() returns dictionary if specified', function() {
    var actual = testFunction({foo: 3, bar: 141, baz: 59});
    var expected = {foo: 3, bar: 141, baz: 59};
    expect(actual).toEqual(expected);
  });

  it('extractFromFunction() throws error on unsupported fn declaration',
     function() {
       // Create function with stubbed toString() method to simulate invalid
       // signature. This could happen if function signatures are encountered
       // that were not accounted for by the current implementation.
       var badFunction = function() {};
       badFunction.toString = function() {
         return 'bad signature';
       };
       expect(function() {
         NamedArgs.extractFromFunction(badFunction, []);
       }).toThrow();
     });
});
