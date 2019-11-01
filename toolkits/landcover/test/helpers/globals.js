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
 * @fileoverview Sets up globals needed to run EE Code Editor code on NodeJS.
 *
 * Automatically executed by Jasmine before tests are run.
 */

var ee = require('@google/earthengine');
var Module = require('module');

// Base path of shared repo containing toolkit source. Replaced with relative
// paths when running tests.
var SHARED_REPO_PREFIX_REGEX = /^.*:landcover\//;

// Make ee namespace available to all modules.
global.ee = ee;

// Store a reference to original require() method so we can call it with
// updated paths.
var _require = Module.prototype.require;

/**
 * Replace Code Editor require() paths used by API implementation with local
 * implementations.
 *
 * @param {string} path The path of the module to include
 * @return {!Module} The required module.
 */
Module.prototype.require = function(path) {
  path = path.replace(SHARED_REPO_PREFIX_REGEX, __dirname + '/../../');
  path = Module._resolveFilename(path, this);
  return _require.call(this, path);
};
