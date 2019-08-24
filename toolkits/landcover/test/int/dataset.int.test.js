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

  fit('computeCommonBandNames_()', function(done) {
    TestDataset(TEST_VALUES)
        .computeCommonBandNames_(ee.List(['B4', 'B3', 'B2', 'foo']))
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          expect(actual).toEqual(['red', 'green', 'blue', 'foo']);
          done();
        });
  });

  fit('addBandIndices(\'ndvi\')', function(done) {
    var l8 = TestDataset(TEST_VALUES).addBandIndices('ndvi');
    TestImage.reduceConstant(l8.getImageCollection().first())
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          // Check calculated value.
          expect(actual['ndvi']).toBeCloseTo(0.1111, 4 /*precision*/);
          // Make sure our original bands are still there too.
          delete actual['ndvi'];
          expect(actual).toEqual(TEST_VALUES);
          done();
        });
  });

  fit('addBandIndices(\'ndsi\')', function(done) {
    var l8 = TestDataset(TEST_VALUES).addBandIndices('ndsi');
    TestImage.reduceConstant(l8.getImageCollection().first())
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          // Check calculated value.
          expect(actual['ndsi']).toBeCloseTo(-0.3333, 4 /*precision*/);
          // Make sure our original bands are still there too.
          delete actual['ndsi'];
          expect(actual).toEqual(TEST_VALUES);
          done();
        });
  });

  it('Make temporalComposites', function(done) {
    lct.Landsat8('SR')
        .filterBounds(geometry)
        .createTemporalComposites('2016-01-01', 12, 7, 'day')
        .getImageCollection()
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          // About 1/2 of the dates have no images.
          expect(actual.features.length).toBe(5);
          expect(actual.features[0]['id']).toBe('20160101');
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
