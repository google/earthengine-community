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
 * @fileoverview Configures pretty-printed output when running tests
 * interactively from command-line.
 */

var JasmineConsoleReporter = require('jasmine-console-reporter');

var reporter = new JasmineConsoleReporter({
  colors: true,
  cleanStack: true,
  verbosity: 4,
  listStyle: 'flat', // "flat"|"indent"
  timeUnit: 'ms', // "ms"|"ns"|"s"
  timeThreshold: {ok: 500, warn: 1000, ouch: 3000},
  activity: 'star',
  emoji: true,
  beep: true
});

// Configures pretty printed stdout logging, useful when running tests
// interactively.
jasmine.getEnv().addReporter(reporter);
