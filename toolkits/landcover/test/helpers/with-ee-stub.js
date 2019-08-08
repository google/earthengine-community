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
 *
 * @fileoverview Declares test harness for running tests locally, stubbing out
 * remote server calls.
 *
 * Automatically executed by Jasmine before tests are run.
 */

var algorithms = require('../unit/algorithms.json');

/**
 * Print an error message and fail.
 */
var warnNoNetwork = function() {
  fail(
      'Remote server calls not allowed in unit tests. Be sure to mock relevant functions.');
};

/**
 * Display warnings and fail on network calls.
 */
var mockNetworkCalls = function() {
  spyOn(ee.data, 'send_').and.callFake(warnNoNetwork);
  spyOn(ee.data, 'sendCloudApiRequest_').and.callFake(warnNoNetwork);
  spyOn(ee.data, 'getAlgorithms').and.callFake(function() {
    return algorithms;
  });
};

// TODO(gino-m): Refactor custom encoders into shared util.

/**
 * Converts an Earth Engine function invocation into a human-readable object
 * graph for use in unit tests.
 *
 * @param {*} invocation The Earth Engine API internal representation of
 *    a function invocation.
 * @return {*} A JSON-compatible structure representing the input.  
 */
var encodeFunctionInvocationValue = function(invocation) {
  var args = {};
  for (var argName in invocation.arguments) {
    args[argName] = encode(invocation.arguments[argName]);
  }
  var value = {};
  value[invocation.functionName] = args;
  return value;
};

/**
 * Converts an Earth Engine function definition into a human-readable object
 * graph for use in unit tests.
 *
 * @param {*} definition The Earth Engine API internal representation of
 *    a function definition.
 * @return {*} A JSON-compatible structure representing the input.  
 */
var encodeFunctionDefinitionValue = function(definition) {
  var value = {};
  var argNames = definition.argumentNames;
  value['function(' + argNames.join(', ') + ')'] = encode(definition.body);
  return value;
};

/**
 * Converts an Earth Engine query graph into a human-readable object
 * graph for use in unit tests.
 *
 * @param {*} graph The Earth Engine API internal representation of
 *    a query graph.
 * @return {*} A JSON-compatible structure representing the input.  
 */
var encode = function(graph) {
  if (Object.keys(graph) > 1) {
    throw new Error(
        'Multiple value types in a single ComputedObject: ' + Object.keys(graph));
  }
  var valueType = Object.keys(graph)[0];
  var value = Object.values(graph)[0];
  switch (valueType) {
    case 'functionInvocationValue':
      return encodeFunctionInvocationValue(value);
    case 'functionDefinitionValue':
      return encodeFunctionDefinitionValue(value);
    case 'constantValue':
      return value;
    case 'argumentReference':
      return '$' + value;
    default:
      throw new Error('Unknown value type: ' + valueType);
  }
};

/**
 * Converts an Earth Engine API object into a human-readable object graph
 * for use in unit tests.
 *
 * @param {*} obj The Earth Engine API object to convert.
 * @return {*} A JSON-compatible structure representing the input.  
 */
var encodeForTesting = function(obj) {
  return encode(ee.Serializer.encodeCloudApiPretty(obj));
};

/**
 * Converts arbitrary object into a formatted human-readable JSON string.
 *
 * @param {*} obj The object to convert.
 * @return {string} A formatted JSON string representing the input.
 */
var stringifyJson = function(obj) {
  return JSON.stringify(obj, null, 2);
};

/**
 * Converts an Earth Engine API object into a formatted human-readable object
 * graph for use in debugging unit tests.
 *
 * @param {*} obj The Earth Engine API object to convert.
 * @return {string} A formatted JSON string representing the input.
 */
var stringifyEeObject = function(obj) {
  return '<EE API Object ' + stringifyJson(encodeForTesting(obj)) + '>';
};

/**
 * A custom Jasmine matcher for comparing an Earth Engine API object with its
 * human-readable JSON representation.
 *
 * @param {*} expected The expected value.
 * @return {Function} A Jasmine matcher for use in unit tests.
 */
global.eeObjectMatching = function(expected) {
  // TODO(gino-m): Add diff reporter to make identifying diffs in mismatches
  // easier.
  const matcher = function() {};
  matcher.asymmetricMatch = function(actual) {
    // Use stringify() to perform deep compare on two objects.
    return JSON.stringify(encodeForTesting(actual)) ===
        JSON.stringify(expected);
  };
  matcher.jasmineToString = function() {
    return '<EE API Object ' + stringifyJson(expected) + '>';
  };
  return matcher;
};

// Replace toString() method of all EE ComputedObjects to provide human-
// readable JSON to facilitate debugging.
ee.ComputedObject.prototype.toString = function() {
  return stringifyEeObject(this);
};

/**
 * Runs a test or set of tests locally, mocking out calls that would normally
 * communicate to the remote Earth Engine server. This also sets up the
 * environment so that code intended for use in the Code Editor can be run in
 * Nodejs.
 *
 * @param {string} testDescription The description of the test shown in stdout.
 * @param {!Function} test The actual test(s) to be run.
 */
global.withEarthEngineStub = function(testDescription, test) {
  describe(testDescription + ' [local stub]', function() {
    beforeAll(function() {
      mockNetworkCalls();
      ee.initialize();
    });

    // Invoke the test or set of tests.
    test.call();
  });
};
