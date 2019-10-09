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

var NamedArgs = require('users/google/toolkits:landcover/impl/named-args.js').NamedArgs;

/**
 * Returns a feature collection containing the feature in the Large Scale
 * International Boundaries (LSIB) that matches the specified name or code. If
 * no boundaries match, an empty FeatureCollection is returned.
 *
 * @param {string} nameOrCode The US-recognized country or region name or the
 *     two-letter FIPS country code to match.
 * @return {!ee.FeatureCollection}
 */
function lsib(nameOrCode) {
  var args = NamedArgs.extractFromFunction(lsib, arguments);
  nameOrCode = args.nameOrCode;
  return ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
      .filter(ee.Filter.or(
          ee.Filter.eq('country_na', nameOrCode),
          ee.Filter.eq('country_co', nameOrCode),
          ee.Filter.eq('wld_rgn', nameOrCode)));
}

exports.Region = {
  lsib: lsib
};
