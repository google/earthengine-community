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

var Bands = require('../../impl/bands.js').Bands;
var TestImage = require('../helpers/test-image.js');

withEarthEngine('Bands', function() {
  it('matrixMultiply()', function(done) {
    var image = ee.Image([1, 2]);
    var coef = [[1, 2], [2, 1]];

    var mult = Bands.matrixMultiply(image, coef);
    TestImage.reduceConstant(mult)
      .evaluate(function(actual, error) {
        expect(actual).toEqual({
          'mmult1': 5,
          'mmult2': 4
        });
        done();
      });
  });
});
