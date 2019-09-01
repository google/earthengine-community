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
      'Remote server calls not allowed in unit tests; ' +
      'all functions that make remote calls must be mocked.');
};

/**
 * Display warnings and fail on network calls.
 */
var mockNetworkCalls = function() {
  spyOn(ee.data, 'send_').and.callFake(warnNoNetwork);
  spyOn(ee.data, 'getAlgorithms').and.callFake(function() {
    return algorithms;
  });
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
