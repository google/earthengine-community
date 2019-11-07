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

withEarthEngineStub('Landsat8', function() {
  it('applyCloudAndShadowBitMasks() updates mask', function() {
    var originalImage = ee.Image(0);

    var newImage = Landsat8.maskCloudsAndShadows(originalImage);

    var qa = originalImage.select(Landsat8.QA_BAND);
    var mask = qa.bitwiseAnd(Landsat8.CLOUD_SHADOW_BIT_MASK)
                   .eq(0)
                   .and(qa.bitwiseAnd(Landsat8.CLOUD_BIT_MASK).eq(0));
    var expected = originalImage.updateMask(mask);
    expect(newImage).toEqual(expected);
  });

  it('getTasseledCapCoefficients_() returns coefficients', function() {
    // There are 6 bands in the TC transformation.  There should be 6 coefficients.
    expect(new Landsat8('SR').getTasseledCapCoefficients_().length).toEqual(6);
  });
});
