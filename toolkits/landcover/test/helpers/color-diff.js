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

var colors = require('colors/safe');
var JsDiff = require('diff');
var formatComputedObject = require('./format-computed-object.js').formatComputedObject;

/**
 * Formats an individual diff for display.
 *
 * @param {*} diff The individual diff returned by the diff library.
 * @return {string} Diff line with markers and color codes.
 */
var formatDiff = function(diff) {
  if (diff.added) {
    return colors.green('+' + diff.value);
  } else if (diff.removed) {
    return colors.red('-' + diff.value);
  } else {
    return colors.reset(' ' + diff.value);
  }
};

/**
 * Decorates a Jasmine matcher with ability to pretty-print differences in
 * Earth Engine objects.
 *
 * @param {*} jasmineMatcher The original matcher being decorated.
 * @param {*} desc The textual hint to be displayed in error messages.
 * @return {!Function<*,*>} A Jasmine decorator function.
 */
var decorateMatcher = function(jasmineMatcher, desc) {
  return function(util, customEqualityTesters) {
    return {
      compare: function(actual, expected) {
        var result = jasmineMatcher(util, customEqualityTesters)
                         .compare(actual, expected);
        if (actual instanceof ee.ComputedObject &&
            expected instanceof ee.ComputedObject && !result.pass) {
          var diff = JsDiff.diffLines(
              formatComputedObject(actual), formatComputedObject(expected));
          result.message =
              (result.message || '') + diff.map(formatDiff).join('');
        }
        return result;
      }
    };
  };
};

// Apply decorators before running tests.
beforeAll(function() {
  jasmine.getEnv().addMatchers({
    toBe: decorateMatcher(jasmine.matchers.toBe, 'to be'),
    toEqual: decorateMatcher(jasmine.matchers.toEqual, 'to equal')
  });
});
