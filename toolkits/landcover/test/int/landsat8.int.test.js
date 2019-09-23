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
 */
function TestLandsat8(testCollection) {
  var l8 = lct.Landsat8();
  l8.collection_ = testCollection;
  return l8;
}

withEarthEngine('Landsat8', function() {
  it('fmaskCloudsAndShadows() masks cloudy pixels', function(done) {
    var clearPixel = TestImage.create({pixel_qa: 0, B4: CLEAR_PIXEL_VALUE});
    var cloudyPixel = TestImage.create(
        {pixel_qa: lct.Landsat8.CLOUD_BIT_MASK, B4: CLOUDY_PIXEL_VALUE});
    var testCollection = ee.ImageCollection([clearPixel, cloudyPixel]);
    var l8 = TestLandsat8(testCollection);

    var maskedL8 = l8.fmaskCloudsAndShadows();

    // Verify cloud-free pixel was returned.
    var image = maskedL8.getImageCollection().mosaic();
    var value = TestImage.reduceConstant(image).get('B4');
    value.evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      expect(actual).toEqual(CLEAR_PIXEL_VALUE);
      done();
    });
  });

  it('fmaskCloudsAndShadows() masks shadowy pixels', function(done) {
    var clearPixel = TestImage.create({pixel_qa: 0, B4: CLEAR_PIXEL_VALUE});
    var shadowyPixel = TestImage.create({
      pixel_qa: lct.Landsat8.CLOUD_SHADOW_BIT_MASK,
      B4: SHADOWY_PIXEL_VALUE
    });
    var testCollection = ee.ImageCollection([clearPixel, shadowyPixel]);
    var l8 = TestLandsat8(testCollection);

    var maskedL8 = l8.fmaskCloudsAndShadows();

    // Verify cloud shadow-free pixel was returned.
    var image = maskedL8.getImageCollection().mosaic();
    var value = TestImage.reduceConstant(image).get('B4');
    value.evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      expect(actual).toEqual(CLEAR_PIXEL_VALUE);
      done();
    });
  });
});
