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
 * Create an instance of lct.Landsat7, replacing the backing collection with the
 * specified one.
 *
 * @param {ee.ImageCollection} testCollection
 * @return {!lct.Landsat7}
 */
function TestLandsat7(testCollection) {
  var l7 = lct.Landsat7();
  l7.collection_ = testCollection;
  return l7;
}

withEarthEngine('Landsat7', function() {
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
      TC1: 9437.2,
      TC2: -2057.6,
      TC3: -6483.1,
      TC4: -1863.2,
      TC5: 389.50,
      TC6: 214.7
    });

    var l7 = TestLandsat7(ee.ImageCollection([TestImage.create(INPUT_PIXEL_VALUES)]));
    var tc = l7.addTasseledCap();

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
