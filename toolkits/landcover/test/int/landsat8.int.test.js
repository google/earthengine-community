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
 * Create an instance of lct.Landsat8, replacing the backing collection with the
 * specified one.
 *
 * @param {ee.ImageCollection} testCollection
 * @return {!lct.Landsat8}
 */
function TestLandsat8(testCollection) {
  return lct.Landsat8(testCollection);
}

withEarthEngine('Landsat8', function() {
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
      TC1: 10492.7,
      TC2: -541,
      TC3: -3550.7,
      TC4: -658,
      TC5: 3908.3,
      TC6: -535
    });

    var l8 = TestLandsat8(ee.ImageCollection([TestImage.create(INPUT_PIXEL_VALUES)]));
    var tc = l8.addTasseledCap();

    // Verify cloud shadow-free pixel was returned.
    var image = tc.getImageCollection().mosaic();
    var value = TestImage.reduceConstant(image);
    value.evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      for (key in actual) {
        expect(actual[key]).toBeCloseTo(EXPECTED_VALUES[key], 1e-3);
      }
      done();
    });
  });
});
