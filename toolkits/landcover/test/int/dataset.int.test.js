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
  it('lookupCommonBandNames()', function(done) {
    TestDataset(TEST_VALUES).lookupCommonBandNames(['red', 'green', 'blue', 'foo'])
      .evaluate(function(actual, error) {
        expect(error).toBeUndefined();
        expect(actual).toEqual(['B4', 'B3', 'B2', 'foo']);
        done();
      });
  });

  it('lookupCommonBandNames with existing bands', function(done) {
    TestDataset(TEST_VALUES).lookupCommonBandNames(
        ['red', 'green', 'blue', 'foo'], ['red', 'foo'])
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          expect(actual).toEqual(['red', 'B3', 'B2', 'foo']);
          done();
        });
  });

  it('getCommonBandNames()', function(done) {
    TestDataset(TEST_VALUES).getCommonBandNames()
      .evaluate(function(actual, error) {
        expect(error).toBeUndefined();
        expect(actual.sort()).toEqual(Object.values(TEST_COMMON_BAND_NAMES).sort());
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

  it('addTasseledCap()', function(done) {
    // Fake a dataset with TCC that are constants per band.
    var d = TestDataset(TEST_VALUES);
    d.getTasseledCapCoefficients_ = function() {
      return [
        [1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2],
        [3, 3, 3, 3, 3, 3],
        [4, 4, 4, 4, 4, 4],
        [5, 5, 5, 5, 5, 5],
        [6, 6, 6, 6, 6, 6]];
    };

    var sumOfBands = (2 + 3 + 4 + 5 + 6 + 7) * 1000;
    var TC_RESULT = {
      'TC1': sumOfBands,
      'TC2': sumOfBands * 2,
      'TC3': sumOfBands * 3,
      'TC4': sumOfBands * 4,
      'TC5': sumOfBands * 5,
      'TC6': sumOfBands * 6,
    };
    var result = d.addTasseledCap().getImageCollection().first();
    TestImage.reduceConstant(result)
      .evaluate(function(actual, error) {
        expect(error).toBeUndefined();
        var expected = Object.assign({}, TEST_VALUES, TC_RESULT);
        expect(actual).toEqual(expected);
        done();
      });
    });
});
