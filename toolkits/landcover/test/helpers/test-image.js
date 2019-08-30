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

/**
 * Returns a single constant ee.Image comprised of the bands and values in the
 * specified dictionary.
 *
 * @param {*} values A dictionary containing band names as keys and
 *    corresponding numeric values. The values are used to build an ee.Image
 *    with a single constant value in each respective band.
 * @param {string} startDate An optional start date for the image, in YYYY-MM-DD
 *    format.
 * @returns {!ee.Image}
 */
var create = function(values, startDate) {
  var image = ee.Dictionary(values).toImage().int64();
  if (startDate) {
    image = image.set('system:time_start', ee.Date(startDate).millis());
  }
  return image;
};

/**
 * Reduces the specified constant ee.Image to a dictionary with one key per
 * band.
 *
 * @param {!ee.Image} image A constant ee.Image (an image with a single value).
 * @returns {*} A dictionary keyed by band name.
 */
var reduceConstant = function(image) {
  return ee.Image(image).reduceRegion(
      ee.Reducer.first(), ee.Geometry.Point(0, 0), 1);
};

exports.create = create;
exports.reduceConstant = reduceConstant;
