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

withEarthEngine('Composites', function() {
  it('createTemporalComposites()', function(done) {
    var testCollection = ee.ImageCollection([
      TestImage.create({value: 100}, '2015-12-01'),
      TestImage.create({value: 150}, '2015-12-15'),
      TestImage.create({value: 200}, '2016-01-01'),
      TestImage.create({value: 250}, '2016-01-15'),
      TestImage.create({value: 300}, '2016-02-01'),
      TestImage.create({value: 350}, '2016-02-15'),
      TestImage.create({value: 400}, '2016-03-01'),
      TestImage.create({value: 450}, '2016-03-15'),
      TestImage.create({value: 500}, '2016-04-01'),
      TestImage.create({value: 550}, '2016-04-15')
    ]);

    var result = lct.Composites.createTemporalComposites(
        testCollection,
        /* startDate= */ '2016-01-01',
        /* count= */ 3,
        /* interval= */ 1,
        /* intervalUnits= */ 'month', ee.Reducer.mean());

    TestImage.reduceConstants(result.select('value'))
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          // Mean value in each valid 3 month range.
          expect(actual).toEqual([{value: 225}, {value: 325}, {value: 425}]);
          done();
        });
  });

  it('createMedioidComposite()', function(done) {
    // Median idx = 3, so we expect the pixel(s) with idx closest to that
    // value to be returned.
    var testCollection = ee.ImageCollection([
      TestImage.create({idx: 1, value: 101}),
      TestImage.create({idx: 2, value: 102}),
      TestImage.create({idx: 3, value: 103}),
      TestImage.create({idx: 4, value: 104}),
      TestImage.create({idx: 5, value: 105})
    ]);

    var composite =
        lct.Composites.createMedioidComposite(testCollection, 'idx');

    TestImage.reduceConstant(composite).evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      expect(actual).toEqual({idx: 3, value: 103});
      done();
    });
  });

  it('createMedioidFunction()', function(done) {
    // The first and last dates will be excluded by the temporal composite
    // criteria below. The 5 images in between will be used, with mosaic
    // built using median index value of 3.
    var testCollection = ee.ImageCollection([
      TestImage.create({idx: 0, value: 100}, '2015-12-01'),
      TestImage.create({idx: 1, value: 101}, '2016-01-01'),
      TestImage.create({idx: 2, value: 102}, '2016-01-02'),
      TestImage.create({idx: 3, value: 103}, '2016-01-03'),
      TestImage.create({idx: 4, value: 104}, '2016-01-04'),
      TestImage.create({idx: 5, value: 105}, '2016-01-05'),
      TestImage.create({idx: 6, value: 106}, '2016-06-01')
    ]);

    // With 1 composite, this should be equivalent to the
    // medioidComposite test.
    var compositor = lct.Composites.createMedioidFunction('idx');
    var result = lct.Composites.createTemporalComposites(
        testCollection,
        /* startDate= */ '2016-01-01',
        /* count= */ 1,
        /* interval= */ 31,
        /* intervalUnits= */ 'day', compositor);

    TestImage.reduceConstants(result).evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      // Mean value in each valid 3 month range.
      expect(actual).toEqual(
          [{date: 1451779200000, idx: 3, observations: 5, value: 103}]);
      done();
    });
  });
});
