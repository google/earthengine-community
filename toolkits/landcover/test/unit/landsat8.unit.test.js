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

var assert = require('assert');
var lct = require('../../api');

withEarthEngineStub('Landsat8', function() {
  it('fmaskCloudsAndShadows()', function() {
    var dataset = lct.Landsat8();
    // Mock the Image constructor instead of creating an ImageCollection with a
    // mock Image. We do this because provided images are copied at construction
    // time, in which case the mocks would not get used internally. In this case
    // the constructor will always return this instance.
    var image = ee.Image(0);
    spyOn(ee, 'Image').and.returnValue(image);
    // Return {} since EE expects updateMask() to always return a non-empty
    // result.
    spyOn(image, 'updateMask').and.returnValue({});

    dataset.fmaskCloudsAndShadows();

    // Sanity check that we made it through to the updateMask() call.
    expect(image.updateMask).toHaveBeenCalled();
  });
});
