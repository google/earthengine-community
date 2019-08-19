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

var lct = require('../../api');

withEarthEngineStub('Landsat8', function() {
  it('applyCloudAndShadowBitMasks() updates mask', function() {
    var originalImage = ee.Image(0);

    var newImage = lct.Landsat8.applyCloudShadowBitMasks(originalImage);

    var qa = originalImage.select('pixel_qa');
    var mask = qa.bitwiseAnd(1 << 3).eq(0).and(qa.bitwiseAnd(1 << 5).eq(0));
    var expected = originalImage.updateMask(mask);
    expect(newImage).toEqual(expected);
  });
});
