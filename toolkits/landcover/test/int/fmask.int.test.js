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

var FMask = require('../../impl/fmask.js');
var TestImage = require('../helpers/test-image.js');

// Arbitrary test value to be used for cloud-free pixels.
var CLEAR_PIXEL_VALUE = 12;
// Arbitrary test value to be used for cloudy pixels.
var CLOUDY_PIXEL_VALUE = 100;
// Arbitrary test value to be used for cloud-shadow pixels.
var SHADOWY_PIXEL_VALUE = 4;

withEarthEngine('FMask', function() {
  it('maskCloudsAndShadows() masks cloudy pixels', function(done) {
    var clearPixel = TestImage.create({
      pixel_qa: 0, B4: CLEAR_PIXEL_VALUE});
    var cloudyPixel = TestImage.create({
      pixel_qa: FMask.CLOUD_BIT_MASK, B4: CLOUDY_PIXEL_VALUE});
    var shadowyPixel = TestImage.create({
      pixel_qa: FMask.CLOUD_SHADOW_BIT_MASK, B4: SHADOWY_PIXEL_VALUE
    });
    var masked1 = FMask.maskCloudsAndShadows(clearPixel);
    var masked2 = FMask.maskCloudsAndShadows(cloudyPixel);
    var masked3 = FMask.maskCloudsAndShadows(shadowyPixel);

    // Verify retured pixels
    var value1 = TestImage.reduceConstant(masked1).get('B4');
    var value2 = TestImage.reduceConstant(masked2).get('B4');
    var value3 = TestImage.reduceConstant(masked3).get('B4');
    ee.List([value1, value2, value3]).evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      expect(actual).toEqual([CLEAR_PIXEL_VALUE, null, null]);
      done();
    });
  });
});
