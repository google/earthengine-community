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
var Dataset = require('../../impl/dataset.js').Dataset;
var TestImage = require('../helpers/test-image.js');

// Values used to construct test dataset.
var TEST_VALUES = {
  B1: 1000,
  B2: 2000,
  B3: 3000,
  B4: 4000,
  B5: 5000,
  B6: 6000,
  B7: 7000,
  B8: 8000,
  B9: 9000,
  B10: 10000,
  B11: 11000
};

// Subset of indices calculated using on TEST_VALUES.
var TEST_INDICES = {
  ndvi: (5000 - 4000) / (5000 + 4000),
  ndsi: (3000 - 6000) / (3000 + 6000),
};

var TEST_COMMON_BAND_NAMES = {
  'B1': 'coastal',
  'B2': 'blue',
  'B3': 'green',
  'B4': 'red',
  'B5': 'nir',
  'B6': 'swir1',
  'B7': 'swir2',
  'B8': 'pan',
  'B9': 'cirrus',
  'B10': 'thermal1',
  'B11': 'thermal2'
};

var TestDataset = function(values) {
  var testImage = TestImage.create(values);
  var testCollection = ee.ImageCollection([testImage]);
  dataset = new Dataset(testCollection);
  dataset.COMMON_BAND_NAMES = TEST_COMMON_BAND_NAMES;
  return dataset;
};

withEarthEngine('Dataset', function() {
  beforeEach(function() {
    // A point in Arizona.
    geometry = ee.Geometry.Point([-111.70715, 36.0225]);
  });

  it('computeCommonBandNames_()', function(done) {
    TestDataset(TEST_VALUES)
        .computeCommonBandNames_(ee.List(['B4', 'B3', 'B2', 'foo']))
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          expect(actual).toEqual(['red', 'green', 'blue', 'foo']);
          done();
        });
  });

  it('addBandIndices()', function(done) {
    var l8 = TestDataset(TEST_VALUES).addBandIndices('ndvi', 'ndsi');
    TestImage.reduceConstant(l8.getImageCollection().first())
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          // Check calculated values to ensure index expressions are correct and
          // that original bands are still present.
          var expected = Object.assign({}, TEST_VALUES, TEST_INDICES);
          expect(actual).toEqual(expected);
          done();
        });
  });

  fit('createTemporalComposites()', function(done) {
    var testCollection = ee.ImageCollection([
      TestImage.create({value: 20151201}, '2015-12-01'),
      TestImage.create({value: 20151215}, '2015-12-15'),
      TestImage.create({value: 20160101}, '2016-01-01'),
      TestImage.create({value: 20160115}, '2016-01-15'),
      TestImage.create({value: 20160201}, '2016-02-01'),
      TestImage.create({value: 20160215}, '2016-02-15'),
      TestImage.create({value: 20160301}, '2016-03-01'),
      TestImage.create({value: 20160315}, '2016-03-15'),
      TestImage.create({value: 20160401}, '2016-04-01'),
      TestImage.create({value: 20160415}, '2016-04-15')
    ]);

    var result = Composites.createTemporalComposites(
        testCollection,
        /* startDate= */ '2016-01-01',
        /* count= */ 3,
        /* interval= */ 1,
        /* intervalUnits= */ 'month', ee.Reducer.max());

    result.toList(10)
        .map(function(img) {
          return TestImage.reduceConstant(img).get('value');
        })
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          expect(actual).toEqual([20160115, 20160215, 20160315]);
          done();
        });
  });

  it('Compute medioidComposite', function(done) {
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
    // With 1 composite,this should be equivalent to the
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
