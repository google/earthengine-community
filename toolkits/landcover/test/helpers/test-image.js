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

var collectBands = function(values) {
  var result;
  for (var band in values) {
    var value = values[band];
    var img = ee.Image(value).rename(band);
    if (!isNaN(value)) {
      img = img.int16();
    }
    if (result) {
      result = result.addBands(img);
    } else {
      result = img;
    }
  }
  return result;
};

var create = function(date, values) {
  var image = collectBands(values || {}) || ee.Image();
  image = image.set('system:time_start', ee.Date(date).millis());
  return image;
};

var reduce = function(image) {
  return image.reduceRegion(ee.Reducer.first(), ee.Geometry.Point(0, 0), 1);
};

exports.create = create;
exports.reduce = reduce;