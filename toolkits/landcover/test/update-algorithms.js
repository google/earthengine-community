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

var ee = require('@google/earthengine');
var fs = require('fs');

// TODO(gino-m): Add private key into Travis encrypted environment variables to
// allow continuous integraton testing:
// https://docs.travis-ci.com/user/environment-variables/#defining-variables-in-repository-settings
var privateKey = require('./.private-key.json');

// The path of the file where the algorithms are written.
var ALGORITHMS_PATH = 'test/unit/algorithms.json';

/**
 * Prune descriptions from algorithms and related args.
 *
 * @param {!Array<!Object>} algorithms The list of algorithms to be pruned.
 */
var deleteDescriptions = function(algorithms) {
  for (var key in algorithms) {
    var alg = algorithms[key];
    // Remove algorithm descriptions.
    delete alg.description;
    for (var idx in alg.args) {
      // Remove args descriptions.
      delete alg.args[idx].description;
    }
  }
};

/**
 * Logs an error message to the console, if present.
 *
 * @param {?string} err The error to print, or null if none.
 */
var logError = function(err) {
  if (err) console.error(err);
};

/**
 * Downloads the EE algorithms from the server and writes them to the local file
 * system. These are then used when running unit tests to ensure late-loaded API
 * calls are defined. Previously downloaded algorithms will be overwritten.
 */
var updateAlgorithms = function() {
  console.log('Downloading API definitions...');
  ee.data.getAlgorithms(function(algorithms) {
    deleteDescriptions(algorithms);
    var json = JSON.stringify(algorithms);
    fs.writeFile(ALGORITHMS_PATH, json, _logError);
    console.log('Algorithms written to ' + ALGORITHMS_PATH);
  });
};

ee.data.authenticateViaPrivateKey(privateKey, updateAlgorithms, logError);
