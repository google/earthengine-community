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

// Character used to generate indent.
var INDENT_CHAR = ' ';
// Number of INDENT_CHARs to render for each intent level.
var INDENT_COUNT = 2;

/**
 * Generates whitespace used to indent formatted output.
 *
 * @param {number} level The number of levels of nesting in code used to
 *    determine to amount of indent.
 * @return {string} The appropriate amount of whitespace used for indenting.
 */
var indent = function(level) {
  return INDENT_CHAR.repeat(level * INDENT_COUNT);
};

/**
 * Converts Earth Engine function invocation args into a formatted list of
 * 'key: value' pairs used to build the debug string.
 *
 * @param {*} args The Earth Engine API internal representation of
 *    a function invocation args.
 * @param {number} level The number of levels of function nesting, used to
 *    calculate indentation size.
 * @return {string}
 */
var formatFunctionInvocationArgs = function(args, level) {
  var argsList = [];
  for (var argName in args) {
    argsList.push(
        '\n' + indent(level) + argName + ': ' +
        formatGraph(args[argName], level));
  }
  return argsList.join(', ');
};

/**
 * Converts an Earth Engine function invocation into a string expression useful
 * for debugging.
 *
 * @param {*} invocation The Earth Engine API internal representation of
 *    a function invocation.
 * @param {number} level The number of levels of function nesting, used to
 *    calculate indentation size.
 * @return {string} A formatted expression describing the specified function.
 */
var formatFunctionInvocationValue = function(invocation, level) {
  var args = formatFunctionInvocationArgs(invocation.arguments, level + 1);
  if (args.length > 0) {
    args = '{' + args + '\n' + indent(level) + '}';
  }
  return 'ee.' + invocation.functionName + '(' + args + ')';
};

/**
 * Converts an Earth Engine function definition into a string expression useful
 * for debugging.
 *
 * @param {*} definition The Earth Engine API internal representation of
 *    a function definition.
 * @param {number} level The number of levels of function nesting, used to
 *    calculate indentation size.
 * @return {string} A formatted expression describing the specified function.
 */
var formatFunctionDefinitionValue = function(definition, level) {
  return 'function(' + definition.argumentNames.join(', ') + ') { ' +
      format(definition.body, level + 1) + ' }';
};

var formatConstantValue = function(value) {
  if (Array.isArray(value)) {
    return '[' + value.map(formatConstantValue) + ']';
  } else if (isNaN(value)) {
    return '\'' + value.replace('\'', '\\\'') + '\'';
  } else {
    return parseFloat(value);
  }
};

/**
 * Converts an Earth Engine query graph into a string expression useful for
 * debugging.
 *
 * @param {*} graph The Earth Engine API internal representation of
 *    a query graph.
 * @param {number} level The number of levels of function nesting, used to
 *    calculate indentation size.
 * @return {string} A formatted expression describing the specified graph.
 */
var formatGraph = function(graph, level) {
  if (Object.keys(graph) > 1) {
    throw new Error(
        'Multiple value types in a single ComputedObject: ' +
        Object.keys(graph));
  }
  var valueType = Object.keys(graph)[0];
  var value = Object.values(graph)[0];
  switch (valueType) {
    case 'functionInvocationValue':
      return formatFunctionInvocationValue(value, level);
    case 'functionDefinitionValue':
      return formatFunctionDefinitionValue(value, level);
    case 'constantValue':
      return formatConstantValue(value);
    case 'argumentReference':
      return '$' + value;
    default:
      throw new Error('Unknown value type: ' + valueType);
  }
};

/**
 * Converts an Earth Engine API object into a string expression useful for
 * debugging. The returned expression is not intended to be invoked as code.
 * Instead, it's solely for debugging the state of Earth Engine objects in unit
 * tests.
 *
 * @param {!ee.ComputedObject} obj The Earth Engine API object to convert.
 * @return {string} A formatted expression describing the specified object.
 */
exports.formatComputedObject = function(obj) {
  return '\n' + formatGraph(ee.Serializer.encodeCloudApiPretty(obj), 0);
};
