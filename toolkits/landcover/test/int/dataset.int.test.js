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

var Dataset = require('../../impl/dataset.js').Dataset;
var TestImage = require('../helpers/test-image.js');

// Values used to construct test dataset.
var TEST_VALUES = {
  blue: 2000,
  green: 3000,
  red: 4000,
  nir: 5000,
  swir1: 6000,
  swir2: 8000,
};

// Subset of indices calculated using on TEST_VALUES.
var TEST_INDICES = {
  ndvi: (5000 - 4000) / (5000 + 4000),
  ndsi: (3000 - 6000) / (3000 + 6000),
};

/**
 * Generate a test dataset using the given collection and band list.
 *
 * @param {!ee.ImageCollection} collection The collection to use in the dataset.
 * @param {Array<number>=} bands The list of bands expected in the collection.
 * @return {!Dataset}
 */
var TestDataset = function(collection, bands) {
  dataset = new Dataset(collection);
  dataset.bands = bands || [];
  return dataset;
};

withEarthEngine('Dataset', function() {
  it('addBandIndices()', function(done) {
    var collection = ee.ImageCollection([TestImage.create(TEST_VALUES)]);
    var dataset = TestDataset(collection, Object.keys(TEST_VALUES))
        .addBandIndices('ndvi', 'ndsi');
    TestImage.reduceConstant(dataset.getImageCollection().first())
      .evaluate(function(actual, error) {
        expect(error).toBeUndefined();
        // Check calculated values to ensure index expressions are correct and
        // that original bands are still present.
        var expected = Object.assign({}, TEST_VALUES, TEST_INDICES);
        expect(actual).toEqual(expected);
        done();
      });
  });

  it('merge()', function(done) {
    // Two datasets with 'b' and 'c' bands common between them.
    var testImage1 = TestImage.create({a: 1, b: 2, c: 3});
    var testImage2 = TestImage.create({b: 4, c: 5, d: 6});
    var testImage3 = TestImage.create({b: 7, c: 8, d: 9});
    var collection1 = ee.ImageCollection([testImage1]);
    var collection2 = ee.ImageCollection([testImage2, testImage3]);
    var dataset1 = TestDataset(collection1, ['a', 'b', 'c']);
    var dataset2 = TestDataset(collection2, ['b', 'c', 'd']);

    var merged = dataset1.merge(dataset2);
    var collection3 = merged.getImageCollection();
    var result = ee.Dictionary({
      size: collection3.size(),
      bands: ee.Image(collection3.first()).bandNames(),
    });
    result.evaluate(function(actual, error) {
      expect(error).toBeUndefined();
      expect(actual).toEqual({
        size: 3,
        bands: ['b', 'c']
      });
      done();
    });
  });
});
