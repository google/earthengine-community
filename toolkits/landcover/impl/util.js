/**
 * @license
 * Copyright 2019 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Utility functions used in multiple files. */
exports.Util = {
  /**
   * Given a dictionary of dictionaries, extract the 'name' properties from
   * each inner dictionary and return them as a list.
   * @param {!Object} dict The dictionary containing other dictionaries.
   * @param {!string} name The name of the property to extract.
   * @return {!Array}
   */
  extractNamedValuesAsList: function(dict, name) {
    var pairs = ee.Dictionary(dict).map(function(key, inner) {
      return [key, ee.Dictionary(inner).get(name)];
    });
    return ee.Dictionary(pairs.values().flatten());
  }
};
