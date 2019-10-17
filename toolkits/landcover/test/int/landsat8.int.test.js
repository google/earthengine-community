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

var lct = require('../../api.js');
var TestImage = require('../helpers/test-image.js');

// Arbitrary test value to be used for cloud-free pixels.
var CLEAR_PIXEL_VALUE = 12;
// Arbitrary test value to be used for cloudy pixels.
var CLOUDY_PIXEL_VALUE = 100;
// Arbitrary test value to be used for cloud-shadow pixels.
var SHADOWY_PIXEL_VALUE = 4;

/**
 * Create an instance of lct.Landsat8, replacing the backing collection with the
 * specified one.
 *
 * @param {ee.ImageCollection} testCollection
 * @return {!lct.Landsat8}
 */
function TestLandsat8(testCollection) {
  var l8 = lct.Landsat8();
  l8.collection_ = testCollection;
  return l8;
}

withEarthEngine('Landsat8', function() {
  it('maskCloudsAndShadows() masks cloudy pixels', function(done) {
    var clearPixel = TestImage.create({pixel_qa: 0, B4: CLEAR_PIXEL_VALUE});
    var cloudyPixel = TestImage.create(
        {pixel_qa: lct.Landsat8.CLOUD_BIT_MASK, B4: CLOUDY_PIXEL_VALUE});
    var testCollection = ee.ImageCollection([clearPixel, cloudyPixel]);
    var l8 = TestLandsat8(testCollection);

    var maskedL8 = l8.maskCloudsAndShadows();

    // Verify cloud-free pixel was returned.
    var image = maskedL8.getImageCollection().mosaic();
    var value = TestImage.reduceConstant(image).get('B4');
    value.evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      expect(actual).toEqual(CLEAR_PIXEL_VALUE);
      done();
    });
  });

  it('maskCloudsAndShadows() masks shadowy pixels', function(done) {
    var clearPixel = TestImage.create({pixel_qa: 0, B4: CLEAR_PIXEL_VALUE});
    var shadowyPixel = TestImage.create({
      pixel_qa: lct.Landsat8.CLOUD_SHADOW_BIT_MASK,
      B4: SHADOWY_PIXEL_VALUE
    });
    var testCollection = ee.ImageCollection([clearPixel, shadowyPixel]);
    var l8 = TestLandsat8(testCollection);

    var maskedL8 = l8.maskCloudsAndShadows();

    // Verify cloud shadow-free pixel was returned.
    var image = maskedL8.getImageCollection().mosaic();
    var value = TestImage.reduceConstant(image).get('B4');
    value.evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      expect(actual).toEqual(CLEAR_PIXEL_VALUE);
      done();
    });
  });

  it('tasseledCap', function(done) {
    var INPUT_PIXEL_VALUES = {
      B2: 2000,
      B3: 3000,
      B4: 4000,
      B5: 5000,
      B6: 6000,
      B7: 7000
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
