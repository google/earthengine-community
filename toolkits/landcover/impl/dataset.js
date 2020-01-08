/**
 * @license
 * Copyright 2019 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Composites = require('users/google/toolkits:landcover/impl/composites.js').Composites;
var Bands = require('users/google/toolkits:landcover/impl/bands.js').Bands;
var NamedArgs = require('users/google/toolkits:landcover/impl/named-args.js').NamedArgs;

/**
 * Returns a new dataset instance for an arbitrary image collection.
 *
 * Datasets are convenience wrappers on top of ImageCollection with pass-through
 * functions into other modules.  They also attemnpt to keep track of the expected
 * bandnames in the collection.
 *
 * @constructor
 * @param {!ee.ImageCollection} collection The collection backing this dataset.
 * @param {!Array} optBands A list of band names expected in the collection.
 */
var Dataset = function(collection, optBands) {
  this.collection_ = collection;
  this.bands = optBands || this.bands || [];
};

/** The expected list of the bands in this dataset. */
Dataset.prototype.bands = [];

/**
 * Apply a filter to this dataset.
 *
 * @param {!ee.Filter} filter A filter to apply to this dataset.
 * @return {!Dataset}
 */
Dataset.prototype.filter = function(filter) {
  var args = NamedArgs.extractFromFunction(Dataset.prototype.filter, arguments);
  filter = args.filter;
  this.collection_ = this.collection_.filter(filter);
  return this;
};

/**
 * Filters the dataset by the specified date range.
 *
 * Returns the filtered dataset.
 *
 * @param {!Date|number|string} start The start date as a Date object, a
 *     string representation of a date, or milliseconds since epoch.
 * @param {!Date|number|string} end The end date as a Date object, a
 *     string representation of a date, or milliseconds since epoch.
 * @return {!Dataset}
 */
Dataset.prototype.filterDate = function(start, end) {
  var args = NamedArgs.extractFromFunction(Dataset.prototype.filterDate, arguments);
  start = args.start;
  end = args.end;
  // TODO(gino-m): Implement month and year ranges.
  // TODO(gino-m): Implement single day/month/year.
  this.collection_ = this.collection_.filterDate(start, end);
  return this;
};

/**
 * Filters the dataset by the specified geometry. Items in the collection with a
 * footprint that fails to intersect the bounds will be excluded when the
 * collection is evaluated.
 *
 * This is equivalent to ee.ImageCollection.filterBounds().
 *
 * Returns the filtered dataset.
 *
 * @param {!Feature|!Geometry} geometry The geometry to filter to.
 * @return {!Dataset}
 */
Dataset.prototype.filterBounds = function(geometry) {
  var args = NamedArgs.extractFromFunction(Dataset.prototype.filterBounds, arguments);
  geometry = args.geometry;
  this.collection_ = this.collection_.filterBounds(geometry);
  return this;
};

/**
 * Returns the dataset's resulting image collection.
 *
 * @return {!ee.ImageCollection}
 */
Dataset.prototype.getImageCollection = function() {
  return this.collection_;
};

/**
 * Creates a collection of composite images based on fixed time intervals.
 * Adds a 'date' band to each input image that contains the date of the
 * observation and an 'observations' band to the composite that contains the
 * number of observations that went into each pixel.
 *
 * @param {string|!Date|!ee.Date} startDate The date of the first composite.
 * @param {number} count How many composites to make.
 * @param {number} interval How much to advance the start date of the next
 *        composite in units of intervalUnits.
 * @param {string} intervalUnits The units of interval. One of:
 *        'year', 'month' 'week', 'day', 'hour', 'minute', or 'second'.
 * @param {?ee.Reducer} reducer An optional reducer to be used to reduce
 *        each time period. Defaults to using a median reducer.
 * @return {!ee.ImageCollection}
 */
Dataset.prototype.toTemporalComposites = function(
    startDate, count, interval, intervalUnits, reducer) {
  var args = NamedArgs.extractFromFunction(Dataset.prototype.createTemporalComposites, arguments);
  startDate = args.startDate;
  count = args.count;
  interval = args.interval;
  intervalUnits = args.intervalUnits;
  reducer = args.reducer;
  return Composites.createTemporalComposites(
      this.collection_, startDate, count, interval, intervalUnits, reducer);
};

/**
 * Computes a medoid composite by finding the median and returns the
 * complete observation closest to the median value as measured by
 * euclidiean distance over the specified band(s).
 *
 * @param {Array<string|number>|string|number=} bands A band identifier
 *    (a name, index or regexp) or a list of identifiers of the bands
 *    to use to compute the median value. If omitted, all bands are used.
 * @return {!ee.Image}
 */
Dataset.prototype.toMedoidComposite = function(bands) {
  var args = NamedArgs.extractFromFunction(Dataset.prototype.createMedoidComposite, arguments);
  bands = ee.List(args.bands);
  return Composites.createMedoidComposite(this.collection_, bands);
};

/**
 * Add spectral indices to each image in the dataset.
 * @param {...string} var_names The names of the spectral indexes to add.
 *     Must be string literals.
 * @return {!Dataset}
 */
// eslint-disable-next-line camelcase
Dataset.prototype.addBandIndices = function(var_names) {
  var indices = Array.prototype.slice.call(arguments);

  var output = this.collection_.map(function(image) {
    var results = Bands.getSpectralIndices(image, indices);
    return image.addBands(results);
  });

  this.bands = ee.List(this.bands).cat(indices);
  this.collection_ = output;
  return this;
};

/**
 * Adds a band (date) to each image in the dataset's collection,
 * containing the date of the image in milliseconds since the epoch.
 *
 * @return {!Dataset}
 */
Dataset.prototype.addDateBand = function() {
  this.collection_ = Bands.addDateBand(this.collection_);
  this.bands = ee.List(this.bands).push(Bands.DATE_BANDNAME);
  return this;
};

/**
 * Adds a band (doy) to each image in the dataset's collection,
 * containing the day of year of the image.
 *
 * @return {!Dataset}
 */
Dataset.prototype.addDayOfYearBand = function() {
  this.collection_ = Bands.addDayOfYearBand(this.collection_);
  this.bands = ee.List(this.bands).push(Bands.DAY_OF_YEAR_BANDNAME);
  return this;
};

/**
 * Adds a band (fYear) to each image in the dataset's collection,
 * containing the fractional year (year + doy/365) of the image.
 *
 * @return {!Dataset}
 */
Dataset.prototype.addFractionalYearBand = function() {
  this.collection_ = Bands.addFractionalYearBand(this.collection_);
  this.bands = ee.List(this.bands).push(Bands.FRACTIONAL_YEAR_BANDNAME);
  return this;
};

/**
 * Merge two datasets, producing a new generic dataset.
 * Any bands that are not in both datasets are removed before the merge.
 *
 * @param {!Dataset} other The Dataset to merge with this one.
 * @return {!Dataset}
 */
Dataset.prototype.merge = function(other) {
  var other = NamedArgs.extractFromFunction(Dataset.prototype.merge, arguments).other;

  /** Find the intersection of elements between the two lists of bandnames. */
  var common = ee.List(this.bands).filter(ee.Filter.inList('item', other.bands));
  var c1 = this.getImageCollection().select(common);
  var c2 = other.getImageCollection().select(common);
  var dataset = new Dataset(c1.merge(c2));
  dataset.bands = common;
  return dataset;
};

exports.Dataset = Dataset;
