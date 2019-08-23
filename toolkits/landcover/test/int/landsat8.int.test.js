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
var TestImage = require('../helpers/test-image.js');

withEarthEngine('Landsat8', function() {
  it('fmaskCloudsAndShadows() masks cloud pixels', function(done) {
    var clearPixel = TestImage.create('2018-03-01', {pixel_qa: 0, B4: 12});
    var cloudyPixel = TestImage.create(
        '2018-03-01', {pixel_qa: Landsat8.CLOUD_BIT_MASK, B4: 100});
    var testCollection = ee.ImageCollection([clearPixel, cloudyPixel]);
    var image = Landsat8(testCollection)
                    .fmaskCloudsAndShadows()
                    .getImageCollection()
                    .mosaic();

    // Verify cloud-free pixel was returned.
    TestImage.reduce(image).get('B4').evaluate(function(actual) {
      expect(actual).toEqual(12);
      done();
    });
  });
});
