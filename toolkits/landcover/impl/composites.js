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
 *
 * @fileoverview Static functions for compositing.
 */

var NamedArgs = require('users/google/toolkits:landcover/impl/named-args.js').NamedArgs;

/**
 * Convert a collection into composite images based on fixed time intervals.
 * Adds a 'date' band to each input image that contains the date of the
 * observation and an 'observations' band to the composite that contains the
 * number of observations that went into each pixel.
 *
 * @param {!ee.ImageCollection} collection The collection to composite.
 * @param {string|!Date|!ee.Date} startDate The date of the first composite.
 * @param {number} count How many composites to make.
 * @param {number} interval How much to advance the start date of the next
 *        composite in units of intervalDate.
 * @param {string} intervalUnits The units of interval. One of:
 *        'year', 'month' 'week', 'day', 'hour', 'minute', or 'second'.
 * @param {?ee.Reducer|function(*=): !ee.Image=} compositor An
 *        optional reducer or compositing function to be used to composite
 *        each time period. Defaults to median reducer.
 * @return {!ee.ImageCollection}
 */
function createTemporalComposites(
    collection, startDate, count, interval, intervalUnits, compositor) {
  var args = NamedArgs.extractFromFunction(createTemporalComposites, arguments);
  collection = args.collection;
  startDate = ee.Date(args.startDate);
  count = ee.Number(args.count);
  interval = ee.Number(args.interval);
  intervalUnits = args.intervalUnits;
  compositor = args.compositor || ee.Reducer.median();
  var images = ee.List.sequence(0, count.subtract(1)).map(function(n) {
    // Compute temporal extent for one interval.
    var begin = startDate.advance(interval.multiply(n), intervalUnits);
    var end = begin.advance(interval, intervalUnits);
    // Add a date band and mask it to the union of masks of input bands.
    var images = collection.filterDate(begin, end).map(function(img) {
      var date = ee.Image.constant(img.date().millis()).rename('date').long();
      var mask = img.mask().reduce(ee.Reducer.max());
      return img.addBands(date.updateMask(mask));
    });

    var mosaic = null;
    if (compositor instanceof ee.Reducer) {
      mosaic = images.reduce(compositor);
      // Strip the reducer suffix off the bands.
      var bands = mosaic.bandNames().map(function(s) {
        return ee.String(s).replace('_[^_]+', '');
      });
      mosaic = mosaic.rename(bands);
    } else {
      mosaic = compositor(images);
    }

    // We count the 'date' band because it's been masked by all the others.
    var count = images.select('date').count().rename('observations');

    return mosaic
        .addBands(count)
        .set('system:time_start', begin.millis())
        .set('system:id', begin.format('YYYYMMdd'))
        .set('system:index', begin.format('YYYYMMdd'));
  });

  // Filter out empty dates (no date band).
  var filtered = ee.ImageCollection.fromImages(images)
      .filter(ee.Filter.listContains('system:band_names', 'date'));
  return filtered;
}

/**
 * Computes a medioid composite by finding the median and returning the
 * complete observation closest to the median value as measured by
 * euclidiean distance over the specified band(s).
 *
 * @param {!ee.ImageCollection} collection The collection to composite.
 * @param {Array<string|number>|string|number=} bands A band identifier
 *    (a name, index or regexp) or a list of identifiers of the bands
 *    to use to compute the median value. If omitted, all bands are used.
 * @return {!ee.ImageCollection}
 */
function createMedioidComposite(collection, bands) {
  var args = NamedArgs.extractFromFunction(createMedioidComposite, arguments);
  collection = args.collection;
  bands = args.bands === undefined ? '.*' : args.bands;

  // Compute the distance from the median of the index band.
  var median = collection.select(bands).median();
  var indexed = collection.map(function(img) {
    var distance = img.select(bands)
        .spectralDistance(median, 'sed')
        .multiply(-1.0)
        .rename('medioid_distance_');
    return img.addBands(distance);
  });
  var mosaic = indexed.qualityMosaic('medioid_distance_');
  var bandNames = mosaic.bandNames().remove('medioid_distance_');
  return mosaic.select(bandNames);
}

/**
 * Returns a function that generates a medioid composite, suitable for
 * passing into temporalComposites as a reducer.
 *
 * @param {Array<string|number>|string|number=} bands A band identifier
 *    (a name, index or regexp) or a list of identifiers of the bands
 *    to use to compute the median value. If omitted, all bands are used.
 * @return {function(*=): !ee.ImageCollection}
 */
function createMedioidFunction(bands) {
  var args = NamedArgs.extractFromFunction(createMedioidFunction, arguments);
  var bands = args.bands;
  return function(collection) {
    return createMedioidComposite(collection, bands);
  };
}

exports.Composites = {
  createMedioidComposite: createMedioidComposite,
  createMedioidFunction: createMedioidFunction,
  createTemporalComposites: createTemporalComposites
};
