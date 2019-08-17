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

var testCollection;
var testPoint;

withEarthEngineStub('Dataset', function() {
  beforeEach(function() {
    testCollection = ee.ImageCollection('TEST');
    testPoint = ee.Geometry.Point([0, 0]);
  });

  it('filterDate() pass-through', function() {
    spyOn(testCollection, 'filterDate');

    var dataset = new Dataset(testCollection);
    dataset.filterDate('2018-01-01', '2018-06-30');

    expect(testCollection.filterDate)
        .toHaveBeenCalledWith('2018-01-01', '2018-06-30');
  });

  it('filterDate() returns self', function() {
    var dataset = new Dataset(ee.ImageCollection('TEST'));

    expect(dataset.filterDate('2018-01-01', '2018-06-30')).toEqual(dataset);
  });

  it('filterBounds() pass-through', function() {
    spyOn(testCollection, 'filterBounds');

    var dataset = new Dataset(testCollection);
    dataset.filterBounds(testPoint);

    expect(testCollection.filterBounds).toHaveBeenCalledWith(testPoint);
  });

  it('filterBounds() returns self', function() {
    var dataset = new Dataset(ee.ImageCollection('TEST'));

    expect(dataset.filterBounds(testPoint)).toEqual(dataset);
  });

  it('createTemporalComposites() pass-through', function() {
    var dataset = new Dataset(testCollection);

    expect(dataset.getImageCollection ()).toEqual(testCollection);
  });
});
