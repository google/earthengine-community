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

var geometry;
var dataset;

withEarthEngine('Dataset', function() {
  beforeEach(function() {
    // A point in Arizona.
    geometry = ee.Geometry.Point([-111.70715, 36.0225]);
    dataset = lct.Landsat8('SR')
        .filterDate('2016-01-02', '2016-01-03')
        .filterBounds(geometry);
  });

  it('Generate common band names', function(done) {
    dataset.computeCommonBandNames_(ee.List(['B4', 'B3', 'B2', 'foo']))
        .evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          expect(actual).toEqual(['red', 'green', 'blue', 'foo']);
          done();
        });
  });

  it('Add spectral indices', function(done) {
    dataset.addBandIndices('ndvi', 'ndsi')
        .getImageCollection()
        .first()
        .bandNames().evaluate(function(actual, error) {
          expect(error).toBeUndefined();
          expect(actual).toContain('ndvi');
          expect(actual).toContain('ndsi');
          // Make sure our original bands are still there too.
          expect(actual).toContain('B3');
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
          expect(actual['fYear']).toBeCloseTo(2016 + 17/365.0, 0.001);
          done();
        });
  });
});
