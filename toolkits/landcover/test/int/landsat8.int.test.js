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
var lct = require('../../api.js');

withEarthEngine('Landsat8', function() {
  it('Filter and mask SR data', function(done) {
    var point = ee.Geometry.Point(36.17819452553215, -4.826158059877228);
    var image = lct.Landsat8('SR')
                    .filterDate('2018-01-01', '2018-04-01')
                    .filterBounds(point)
                    .maskCloudsAndShadows()
                    .getImageCollection()
                    .mosaic();

    // Cloudly pixel be masked out.
    // TODO(gorelick): What would be a better way to test this?
    var redValue = image.select('B4')
                       .reduceRegion(ee.Reducer.first(), point, 10)
                       .get('B4');
    redValue.evaluate(function(actual) {
      assert.equal(actual, null);
      done();
    });
  });
});
