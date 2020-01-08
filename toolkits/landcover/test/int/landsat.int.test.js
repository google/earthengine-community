/**
 * @license
 * Copyright 2019 The Google Earth Engine Community Authors
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

var Landsat = require('../../impl/landsat.js').Landsat;

var TestImage = require('../helpers/test-image.js');

// Values used to construct test dataset.
var TEST_VALUES = {
  blue: 2000,
  green: 3000,
  red: 4000,
  nir: 5000,
  swir1: 6000,
  swir2: 7000,
  pixel_qa: 111
};

/**
 * Create a test instance of a Landsat8 dataset using an image constructed
 * from the given values dictionary.
 * specified one.
 *
 * @param {!Object} values The values dictionary from which to build the test image.
 * @return {!Landsat8}
 */
function TestDataset(values) {
  var testImage = TestImage.create(values);
  var testCollection = ee.ImageCollection([testImage]);
  var dataset = new Landsat(testCollection);
  dataset.bands = Object.keys(values);
  return dataset;
}

withEarthEngine('Landsat', function() {
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

  it('applyQaMask doesn\'t mask good values()', function(done) {
    var notmasked = {B1: 10, B2: 20, pixel_qa: 30};
    var d = TestDataset(notmasked);
    d.VALID_QA_VALUES = [30];
    var result = d.applyQaMask().getImageCollection().first();
    TestImage.reduceConstant(result)
      .evaluate(function(actual, error) {
        expect(error).toBeUndefined();
        expect(actual).toEqual(notmasked);
        done();
      });
   });

  it('applyQaMask masks bad values()', function(done) {
    var masked = {B1: 10, B2: 20, pixel_qa: 30};
    var d = TestDataset(masked);
    d.VALID_QA_VALUES = [31];
    var result = d.applyQaMask().getImageCollection().first();
    TestImage.reduceConstant(result)
      .evaluate(function(actual, error) {
        expect(error).toBeUndefined();
        expect(actual).toEqual({
          B1: null,
          B2: null,
          pixel_qa: null
        });
        done();
      });
  });

  it('applyScaling', function(done) {
    var d = TestDataset({B1: 10, B2: 20});
    d.COMMON_BANDS = {
      'B1': {commonName: 'blue', scaling: 2},
      'B2': {commonName: 'green', scaling: 3}
    };
    var result = d.applyScaling().getImageCollection().first();
    TestImage.reduceConstant(result)
      .evaluate(function(actual, error) {
        expect(error).toBeUndefined();
        expect(actual).toEqual({
          B1: 20,
          B2: 60
        });
        done();
      });
  });

  it('renameCommonBands', function(done) {
    var d = TestDataset({B1: 10, B2: 20, pixel_qa: 30});
    d.COMMON_BANDS = {
      'B1': {commonName: 'blue', scaling: 2},
      'B2': {commonName: 'green', scaling: 3}
    };
    var result = d.renameCommonBands().getImageCollection().first();
    TestImage.reduceConstant(result)
      .evaluate(function(actual, error) {
        expect(error).toBeUndefined();
        expect(actual).toEqual({
          blue: 10,
          green: 20
        });
        done();
      });
  });
});
