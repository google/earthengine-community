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
  compositor = compositor || ee.Reducer.median();
  count = ee.Number(count);
  interval = ee.Number(interval);
  startDate = ee.Date(startDate);
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
 * Computes a medioid composite by finding the median of one band
 * and returning the complete observation where that band is closest
 * to the median value.
 *
 * @param {!ee.ImageCollection} collection The collection to composite.
 * @param {string|number} indexBand The name of the band which to
 *    select the median value. If omitted, the first band is used.
 * @return {!ee.ImageCollection}
 */
function createMedioidComposite(collection, indexBand) {
  // Compute the median of the index band.
  indexBand = indexBand === undefined ? 0 : indexBand;
  var median = collection.select(indexBand).median();

  var mosaic = collection.map(function(img) {
    var diff = median.subtract(img.select(indexBand)).abs();
    var index = ee.Image(0).subtract(diff);
    return img.addBands(index.rename('medioid_index_'));
  }).qualityMosaic('medioid_index_');

  return mosaic.select(mosaic.bandNames().remove('medioid_index_'));
}

/**
 * Returns a function that generates a medioid composite, suitable for
 * passing into temporalComposites as a reducer.
 *
 * @param {string|number} indexBand The band on which to index the medioid.
 * @return {function(*=): !ee.ImageCollection}
 */
function createMedioidFunction(indexBand) {
  return function(collection) {
    return createMedioidComposite(collection, indexBand);
  };
}

exports.Composites = {
  createMedioidComposite: createMedioidComposite,
  createMedioidFunction: createMedioidFunction,
  createTemporalComposites: createTemporalComposites
};
