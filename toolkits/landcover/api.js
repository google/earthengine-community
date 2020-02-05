/**
 * @license
 * Copyright 2019 The Google Earth Engine Community Authors
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
 * @fileoverview Main entry point for toolkit.
 */

var Composites = require('users/google/toolkits:landcover/impl/composites.js').Composites;
var Landsat5 = require('users/google/toolkits:landcover/impl/landsat5.js').Landsat5;
var Landsat7 = require('users/google/toolkits:landcover/impl/landsat7.js').Landsat7;
var Landsat8 = require('users/google/toolkits:landcover/impl/landsat8.js').Landsat8;
var Region = require('users/google/toolkits:landcover/impl/region.js').Region;

exports.Composites = Composites;
exports.Landsat5 = Landsat5;
exports.Landsat7 = Landsat7;
exports.Landsat8 = Landsat8;
exports.Region = Region;
