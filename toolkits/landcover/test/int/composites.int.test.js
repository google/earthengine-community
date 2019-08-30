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

var Composites = require('../../impl/composites.js').Composites;
var TestImage = require('../helpers/test-image.js');

withEarthEngine('Composites', function() {
  fit('createTemporalComposites()', function(done) {
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

    var result = Composites.createTemporalComposites(
        testCollection,
        /* startDate= */ '2016-01-01',
        /* count= */ 3,
        /* interval= */ 1,
        /* intervalUnits= */ 'month', ee.Reducer.mean());

    result.toList(10)
        .map(function(img) {
          return TestImage.reduceConstant(img).get('value');
        })
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          // Mean value in each valid 3 month range..
          expect(actual).toEqual([225, 325, 425]);
          done();
        });
  });

  it('createMedioidComposite()', function(done) {
    lct.Landsat8('SR')
        .filterBounds(geometry)
        .filterDate('2016-01-01', '2016-01-31')
        .addDayOfYearBand()
        .createMedioidComposite('doy')
        .getImageCollection()
        .first()
        .reduceRegion(ee.Reducer.first(), geometry, 1)
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          expect(actual['doy']).toBe(17);
          done();
        });
  });

  it('MedioidFunction in temporalComposites', function(done) {
    // With 1 composite, this should be equivalent to the
    // medioidComposite test.
    var compositor = lct.Composites.createMedioidFunction('date');
    lct.Landsat8('SR')
        .filterBounds(geometry)
        .addDayOfYearBand()
        .addFractionalYearBand()
        .createTemporalComposites('2016-01-01', 1, 31, 'day', compositor)
        .getImageCollection()
        .first()
        .reduceRegion(ee.Reducer.first(), geometry, 1)
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          expect(actual['date']).toBe(1453140198110);
          expect(actual['doy']).toBe(17);
          expect(actual['fYear']).toBeCloseTo(2016 + 17 / 365.0, 0.001);
          done();
        });
  });
});
