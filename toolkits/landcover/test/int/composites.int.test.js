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

    var result = lct.Composites.createTemporalComposites({
        collection: testCollection,
        startDate: '2016-01-01',
        count: 3,
        interval: 1,
        intervalUnits: 'month',
        compositor: ee.Reducer.mean()});

    TestImage.reduceConstants(result.select('value'))
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          // Mean value in each valid 3 month range.
          expect(actual).toEqual([{value: 225}, {value: 325}, {value: 425}]);
          done();
        });
  });

  it('createMedioidComposite() w/single band', function(done) {
    // Median idx = 3, so we expect the pixel(s) with idx closest to that
    // value to be returned.
    var testCollection = ee.ImageCollection([
      // Value #1 for medioid function:
      TestImage.create({idx: 1, value: 10}),
      // Value #2 for medioid function:
      TestImage.create({idx: 2, value: 30}),
      // Value #3 for medioid function (medioid):
      TestImage.create({idx: 3, value: 300}),
      // Value #4 for medioid function:
      TestImage.create({idx: 4, value: 400})
    ]);

    var composite = lct.Composites.createMedioidComposite(
        {collection: testCollection, bands: 'idx'});

    TestImage.reduceConstant(composite).evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      expect(actual).toEqual({idx: 3, value: 300});
      done();
    });
  });

  it('createMedioidComposite() w/multiple bands', function(done) {
    // Median idx = 3, so we expect the pixel(s) with idx closest to that
    // value to be returned.
    var testCollection = ee.ImageCollection([
      // Value #1 for medioid function:
      TestImage.create({a: 1, b: 1, c: 20, value: 200}),
      // Value #2 for medioid function:
      TestImage.create({a: 2, b: 1, c: 10, value: 100}),
      // Value #3 for medioid function (medioid):
      TestImage.create({a: 3, b: 3, c: 30, value: 300}),
    ]);

    var composite = lct.Composites.createMedioidComposite(
        {collection: testCollection, bands: ['a', 'b', 'c']});

    TestImage.reduceConstant(composite).evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      expect(actual).toEqual({a: 1, b: 1, c: 20, value: 200});
      done();
    });
  });

  it('createMedioidFunction()', function(done) {
    // The first and last dates will be excluded by the temporal composite
    // criteria below. The 5 images in between will be used, with mosaic
    // built using median index value of 3.
    var testCollection = ee.ImageCollection([
      // This date will be filtered out.
      TestImage.create({idx: 0, value: 0}, '2015-12-01'),
      // Value #1 for medioid function:
      TestImage.create({idx: 1, value: 10}, '2016-01-01'),
      // Value #2 for medioid function:
      TestImage.create({idx: 2, value: 20}, '2016-01-02'),
      // Value #3 for medioid function (medioid):
      TestImage.create({idx: 3, value: 400}, '2016-01-03'),
      // Value #4 for medioid function;
      TestImage.create({idx: 4, value: 500}, '2016-01-04'),
      // This will also be filtered out (>31d after 2016-01-01).
      TestImage.create({idx: 5, value: 600}, '2016-06-01')
    ]);

    // With 1 composite, this should be equivalent to the
    // medioidComposite test.
    var compositor = lct.Composites.createMedioidFunction('idx');
    var result = lct.Composites.createTemporalComposites({
        collection: testCollection,
        startDate: '2016-01-01',
        count: 1,
        interval: 31,
        intervalUnits: 'day',
        compositor: compositor});

    TestImage.reduceConstants(result).evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      // Mean value in each valid 3 month range.
      expect(actual).toEqual([{
        date: new Date('2016-01-03').getTime(),
        idx: 3,
        observations: 4,
        value: 400
      }]);
      done();
    });
  });
});
