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

var NamedArgs = require('../../impl/named-args.js').NamedArgs;

withEarthEngineStub('NamedArgs', function() {
  it('extractFromFunction() with no args', function() {
    var testFunction = function() {};
    var actual = NamedArgs.extractFromFunction(testFunction, []);
    var expected = {};
    expect(actual).toEqual(expected);
  });

  it('extractFromFunction() builds dictionary', function() {
    var testFunction = function(foo, bar, baz) {};
    var actual = NamedArgs.extractFromFunction(testFunction, [3, 141, 59]);
    var expected = {foo: 3, bar: 141, baz: 59};
    expect(actual).toEqual(expected);
  });

  it('extractFromFunction() returns dictionary if specified', function() {
    var testFunction = function(foo, bar, baz) {};
    var actual = NamedArgs.extractFromFunction(
        testFunction, [{foo: 3, bar: 141, baz: 59}]);
    var expected = {foo: 3, bar: 141, baz: 59};
    expect(actual).toEqual(expected);
  });

  it('extractFromFunction() builds dict for EE objects', function() {
    var testFunction = function(foo) {};
    var testImage = ee.Image([0]);
    var actual = NamedArgs.extractFromFunction(testFunction, [testImage]);
    var expected = {foo: testImage};
    expect(actual).toEqual(expected);
  });

  it('extractFromFunction() builds dict for arrays', function() {
    var testFunction = function(foo) {};
    var testArray = [1, 2, 3];
    var actual = NamedArgs.extractFromFunction(testFunction, [testArray]);
    var expected = {foo: testArray};
    expect(actual).toEqual(expected);
  });

  it('extractFromFunction() builds dict for Dates', function() {
    var testFunction = function(foo) {};
    var testDate = new Date();
    var actual = NamedArgs.extractFromFunction(testFunction, [testDate]);
    var expected = {foo: testDate};
    expect(actual).toEqual(expected);
  });

  it('extractFromFunction() with null args', function() {
    var testFunction = function(foo, bar) {};
    var actual = NamedArgs.extractFromFunction(testFunction, [null, null]);
    var expected = {foo: null, bar: null};
    expect(actual).toEqual(expected);
  });

  it('extractFromFunction() with undefined args', function() {
    var testFunction = function(foo, bar) {};
    var actual =
        NamedArgs.extractFromFunction(testFunction, [undefined, undefined]);
    var expected = {foo: undefined, bar: undefined};
    expect(actual).toEqual(expected);
  });

  it('extractFromFunction() with too few args', function() {
    var testFunction = function(foo, bar) {};
    var actual =
        NamedArgs.extractFromFunction(testFunction, [3]);
    var expected = {foo: 3, bar: undefined};
    expect(actual).toEqual(expected);
  });

  it('extractFromFunction() fails on unsupported fn declaration', function() {
    // Create object with stubbed toString() method to simulate function
    // with invalid signature. This could happen if function signatures are
    // encountered that were not accounted for by the current implementation.
    var badFunction = {
      toString: function() {
        return 'bad signature';
      }
    };
    expect(function() {
      NamedArgs.extractFromFunction(badFunction, []);
    }).toThrow();
  });

    it('extractFromFunction() strips line comments', function() {
      var testFunction = function(
          arg1,  // line comment
          arg2   // line comment 2
      ) {};
      var actual =
          NamedArgs.extractFromFunction(testFunction, ['val1', 'val2']);
      var expected = {arg1: 'val1', arg2: 'val2'};
      expect(actual).toEqual(expected);
    });


    it('extractFromFunction() strips block comments', function() {
      var testFunction = function(
          /* block comment 1 */ arg1,
          /* block comment 2 */ arg2) {};
      var actual =
          NamedArgs.extractFromFunction(testFunction, ['val1', 'val2']);
      var expected = {arg1: 'val1', arg2: 'val2'};
      expect(actual).toEqual(expected);
    });

    it('extractFromFunction() ignore dangling commas', function() {
      var testFunction = function(
          arg1,
          arg2
      ) {};
      var actual =
          NamedArgs.extractFromFunction(testFunction, ['val1', 'val2']);
      var expected = {arg1: 'val1', arg2: 'val2'};
      expect(actual).toEqual(expected);
    });
  });
