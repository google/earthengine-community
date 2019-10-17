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

/**
 * Regular expression used to extract argument names from string represention
 * of a function. This does the following:
 *
 *  1. Match only when declaration starts with "function".
 *  2. Ignores optional space and function name up to first "(".
 *  3. Captures the contents all the way up to the next ")".
 *
 * This expression assume newlines have already been stripped.
 */
var FUNCTION_REGEX = /^function\s*.*?\((.*?)\)/;

/**
 * Regular expression for matching line comments (all content between
 * double-slash (//) and newline, inclusive).
 */
var LINE_COMMENT_REGEX = /[/][/].*\r?\n/g;

/**
 * Regular expression for matching newlines. This includes both standard LFs
 * and Windows CR+LF patterns. We use this to remove newlines, working around
 * the fact that single-line mode isn't supported by JavaScript RegExp.
 */
var NEWLINE_REGEX = /\r?\n/g;

/**
 * Regular expression for matching block comments (all content starting with
 * slash-asterisk and ending with asterisk-slash, inclusive). Assumes newlines
 * were already removed.
 */
var BLOCK_COMMENT_REGEX = /[/][*].*?[*][/]/g;


/**
 * Returns true iff the provided value is a JavaScript dictionary, as opposed
 * to a scalar or a typed class instance.
 *
 * @param {*} value
 * @return {boolean}
 */
function isDictionary_(value) {
  return value.constructor.name === 'Object';
}

/**
 * Returns a dictionary of arguments keyed by function argument name. Toolkit
 * functions to simulate the "named args" feature of other popular languages
 * using plain old JavaScript.
 *
 * @param {!Function} fn The function declaration.
 * @param {!Array<*>} originalArgs The original arguments passed to the function
 *   call.
 * @return {*} Dictionary with values keyed by argument names defined in the
 *   specified function declaration.
 */
function extractFromFunction(fn, originalArgs) {
  // Strip comments and newlines:
  var decl = fn.toString()
                 .replace(LINE_COMMENT_REGEX, '')
                 .replace(NEWLINE_REGEX, '')
                 .replace(BLOCK_COMMENT_REGEX, '');
  // Functions with a single JavaScript dictionary argument are assumed to have
  // been invoked using named args. This precludes us using named args for
  // functions that take a single dictionary as arguments.
  if (originalArgs.length == 1 && isDictionary_(originalArgs[0])) {
    return originalArgs[0];
  }
  // Extract arg names using heuristic regex.
  var regexMatch = decl.match(FUNCTION_REGEX);
  if (!regexMatch || regexMatch.length < 2) {
    throw new Error('Unsupported function declaration:\n' + fn.toString());
  }
  var argNames = regexMatch[1].split(',');
  // Build dictionary keyed by argument name.
  var dict = {};
  for (var i in argNames) {
    var argName = argNames[i].trim();
    if (argName === '') {
      // Ignore dangling commas.
      continue;
    }
    dict[argName] = i < originalArgs.length ? originalArgs[i] : undefined;
  }
  return dict;
};

exports.NamedArgs = {
  extractFromFunction: extractFromFunction
};
