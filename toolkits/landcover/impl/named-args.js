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
 * of a function.
 */
var FUNCTION_REGEX = /^function\s*(?:.*?)\(\s*(.*)\s*\)/;

var NamedArgs = {};

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
NamedArgs.extractFromFunction = function(fn, originalArgs) {
  if (originalArgs.length == 1 && typeof originalArgs[0] === 'object') {
    return originalArgs[0];
  }
  var regexMatch = fn.toString().match(FUNCTION_REGEX);
  if (!regexMatch || regexMatch.length < 2) {
    throw new Error('Unsupported function declaration:\n' + fn.toString());
  }
  var argNames = regexMatch[1].split(',');
  var dict = {};
  for (var i in argNames) {
    var argName = argNames[i].trim();
    dict[argName] = i < originalArgs.length ? originalArgs[i] : undefined;
  }
  return dict;
};

exports.NamedArgs = NamedArgs;
