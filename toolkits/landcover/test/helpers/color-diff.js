var colors = require('colors/safe');
var JsDiff = require('diff');
var formatComputedObject =
    require('./format-computed-object.js').formatComputedObject;

/**
 * Formats an individual diff for display.
 *
 * @param {*} diff The individual diff returned by the diff library.
 * @returns {string} Diff line with markers and color codes.
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
    }
  };
};

// Apply decorators before running tests.
beforeAll(function() {
  jasmine.getEnv().addMatchers({
    toBe: decorateMatcher(jasmine.matchers.toBe, 'to be'),
    toEqual: decorateMatcher(jasmine.matchers.toEqual, 'to equal')
  });
});
