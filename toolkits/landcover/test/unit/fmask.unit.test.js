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

withEarthEngineStub('FMask', function() {
  it('applyCloudAndShadowBitMasks() updates mask', function() {
    var originalImage = ee.Image(0);

    var newImage = FMask.maskCloudsAndShadows(originalImage);

    var qa = originalImage.select(FMask.QA_BAND);
    var mask = qa.bitwiseAnd(FMask.CLOUD_SHADOW_BIT_MASK)
                   .eq(0)
                   .and(qa.bitwiseAnd(FMask.CLOUD_BIT_MASK).eq(0));
    var expected = originalImage.updateMask(mask);
    expect(newImage).toEqual(expected);
  });
});
