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
var formatComputedObject =
    require('../helpers/format-computed-object.js').formatComputedObject;

var create = function(values, startDate) {
  var image = ee.Dictionary(values).toImage().int64();
  if (startDate) {
    image = image.set('system:time_start', ee.Date(startDate).millis());
  }
  return image;
};

withEarthEngineStub('Landsat8', function() {
  it('getSpectralIndices()', function() {
    var testImage = create({'nir': 1, 'aaa': 2});
    var testIndices = ['ndvi', 'evi'];
    var result = Bands.getSpectralIndices(testImage, testIndices);

     console.log(formatComputedObject(result));
  });
});
