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
 * @fileoverview Declares test harness for running tests against live EE server.
 *
 * Automatically executed by Jasmine before tests are run.
 */

/**
 * Authenticates against live Earth Engine server using service account private
 * key stored in ../.private-key.json. On failure, logs an error and exits with
 * and error.
 *
 * @param {!Function} onSuccess The function be called once authentication is
 *     successful.
 */
var authenticate = function(onSuccess) {
  var privateKey = require('../.private-key.json');
  ee.data.authenticateViaPrivateKey(privateKey, onSuccess, fail);
};

/**
 * Runs a test or set of tests against live Earth Engine server. This includes
 * authenticating with the private key provided in /test/.private-key.json,
 * and setting up the environment so that code intended for use in the Code
 * Editor can be run in Nodejs.
 *
 * @param {string} testDescription The description of the test shown in stdout.
 * @param {!Function} test The actual test(s) to be run.
 */
global.withEarthEngine = function(testDescription, test) {
  describe(testDescription + ' [remote]', function() {
    // Authenticate service account and initialize before running tests.
    beforeAll(function(done) {
      authenticate(function() {
        ee.initialize(null, null, done);
      });
    });

    beforeEach(function() {
      // The maximum time an individual remote test case is allowed to run
      // before it fails with a timeout.
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
    });

    // Run the provided test suite.
    test.call();
  });
};
