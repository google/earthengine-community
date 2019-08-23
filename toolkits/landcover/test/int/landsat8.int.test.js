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

var Landsat8 = require('../../api.js').Landsat8;

var collectBands = function(values) {
  var result;
  for (var band in values) {
    var img = ee.Image(values[band]).rename(band);
    if (result) {
      result = result.addBands(img);
    } else {
      result = img;
    }
  }
  return result;
};

var createTestImage = function(date, values) {
  var image = collectBands(values || {}) || ee.Image();
  image = image.set('system:time_start', ee.Date(date).millis());
  return image;
};

withEarthEngine('Landsat8', function() {
  fit('fmaskCloudsAndShadows() masks cloud pixels', function(done) {
    var clearPixel = createTestImage('2018-03-01', {pixel_qa: 0, B4: 12});
    var cloudyPixel = createTestImage(
        '2018-03-01', {pixel_qa: Landsat8.CLOUD_BIT_MASK, B4: 100});
    var testCollection = ee.ImageCollection([clearPixel, cloudyPixel]);
    var image = Landsat8(testCollection)
                    .fmaskCloudsAndShadows()
                    .getImageCollection()
                    .mosaic();

    // Verify cloud-free pixel was returned.
    var redValue = image.select('B4').reduceRegion(ee.Reducer.first());
    redValue.evaluate(function(actual) {
      expect(actual).toEqual(12);
      done();
    });
  });
});
