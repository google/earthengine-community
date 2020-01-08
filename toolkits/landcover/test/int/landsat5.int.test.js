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
 */

var lct = require('../../api.js');
var TestImage = require('../helpers/test-image.js');

/**
 * Create an instance of lct.Landsat5, replacing the backing collection with the
 * specified one.
 *
 * @param {ee.ImageCollection} testCollection
 * @return {!lct.Landsat5}
 */
function TestLandsat5(testCollection) {
  var l5 = lct.Landsat5();
  l5.collection_ = testCollection;
  return l5;
}

withEarthEngine('Landsat5', function() {
  it('tasseledCap', function(done) {
    var INPUT_PIXEL_VALUES = {
      blue: 2000,
      green: 3000,
      red: 4000,
      nir: 5000,
      swir1: 6000,
      swir2: 7000
    };

    // Output should have the input values, plus these.
    var EXPECTED_VALUES = Object.assign({}, INPUT_PIXEL_VALUES, {
      TC1: 10222.6,
      TC2: -180.9,
      TC3: 2514.4,
      TC4: -1528.5,
      TC5: 1731.7,
      TC6: 242.8
    });

    var l5 = TestLandsat5(ee.ImageCollection([TestImage.create(INPUT_PIXEL_VALUES)]));
    var tc = l5.addTasseledCap();

    // Verify expected TC values.
    var image = tc.getImageCollection().mosaic();
    var value = TestImage.reduceConstant(image);
    value.evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      for (key in actual) {
        expect(actual[key]).toBeCloseTo(EXPECTED_VALUES[key], 1);
      }
      done();
    });
  });
});
