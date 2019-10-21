/**
 * @license
 * Copyright 2019 Google LLC
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
 * @constructor
 * @param {!ee.ImageCollection} collection The collection backing this dataset.
 * @param {!ee.data.ImageVisualizationParameters} defaultVisParams The
 *     parameters to be used when adding the resulting collection to a layer for
 *     visualization.
 */
var Dataset = function(collection, defaultVisParams) {
  this.collection_ = collection;
  this.defaultVisParams_ = defaultVisParams;
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
 * Returns the default visualization params to be used when displaying this
 * dataset on a map.
 *
 * @return {!ee.data.ImageVisualizationParameters}
 */
Dataset.prototype.getDefaultVisParams = function() {
  return this.defaultVisParams_;
};

/**
 * Convert a collection into composite images based on fixed time intervals.
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
Dataset.prototype.createTemporalComposites = function(
    startDate, count, interval, intervalUnits, reducer) {
  var args = NamedArgs.extractFromFunction(Dataset.prototype.createTemporalComposites, arguments);
  startDate = args.startDate;
  count = args.count;
  interval = args.interval;
  intervalUnits = args.intervalUnits;
  reducer = args.reducer;
  this.collection_ = Composites.createTemporalComposites(
      this.collection_, startDate, count, interval, intervalUnits, reducer);
  return this;
};

/**
 * Computes a medioid composite by finding the median and returning the
 * complete observation closest to the median value as measured by
 * euclidiean distance over the specified band(s).
 *
 * @param {Array<string|number>|string|number=} bands A band identifier
 *    (a name, index or regexp) or a list of identifiers of the bands
 *    to use to compute the median value. If omitted, all bands are used.
 * @return {!ee.ImageCollection}
 */
Dataset.prototype.createMedioidComposite = function(bands) {
  var args = NamedArgs.extractFromFunction(Dataset.prototype.createMedioidComposite, arguments);
  bands = args.bands;
  this.collection_ = ee.ImageCollection(
      [Composites.createMedioidComposite(this.collection_, bands)]);
  return this;
};

/**
 * Returns the list of 'common' band names.
 * @return {Array<string>} the list of band names.
 */
Dataset.prototype.getCommonBandNames = function() {
  return ee.Dictionary(this.COMMON_BAND_NAMES).values();
};

/**
 * Get the list of bands names corresponding to a list of wanted 'common' bands.
 * If the wanted bands are in "have", they're used directly, otherwise they're renamed.
 *
 * @param {Array<string>=} want The 'common' bands that are wanted.  If undefined, uses
 *     all common bands.
 * @param {Array<string>=} have The bands already available.  If undefined, no bands are assumed.
 * @return {Array<string>} The list of band names to use to get the wanted common bands.
 */
Dataset.prototype.lookupCommonBandNames = function(want, have) {
  var args = NamedArgs.extractFromFunction(Dataset.prototype.lookupCommonBandNames, arguments);
  var common = ee.Dictionary(this.COMMON_BAND_NAMES);
  want = args.want || common.values();
  have = args.have || [];

  // Generate the reverse lookup table.
  var lookup = ee.Dictionary.fromLists(common.values(), common.keys());

  var unwanted = ee.List(have).removeAll(want);
  var alreadyHave = ee.List(have).removeAll(unwanted);

  // If a desired band already exists, overwrite the lookup table with the same band name.
  lookup = lookup.combine(ee.Dictionary.fromLists(alreadyHave, alreadyHave), true);
  // Everything else in want just maps to itself, if it's not already there.
  lookup = lookup.combine(ee.Dictionary.fromLists(want, want), false);

  // Do the lookup.
  var bandsToUse = ee.List(want).map(function(name) {
    return lookup.get(name);
  });
  return bandsToUse;
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

  // Compute the transformation to common band names.
  var dstBands = this.getCommonBandNames();
  var srcBands = this.lookupCommonBandNames(dstBands, this.collection_.first().bandNames());

  var output = this.collection_.map(function(image) {
    // Get the 'common' bands and compute the spectral indices.
    var renamed = image.select(srcBands, dstBands);
    var bands = Bands.getSpectralIndices(renamed, indices);
    return image.addBands(bands);
  });

  this.collection_ = output;
  return this;
};

/**
 * Add the Tasseled Cap transformation to each image in the dataset.
 * See http://doi.org/10.1080/2150704X.2014.915434 for more information about Tasseled Cap.
 *
 * Each dataset subclass will have its own set of Tasseled Cap coefficients if it's supported.
 * The output bands will be named: [TC1, TC2, TC3, TC4, TC5, TC6];
 *
 * @return {!Dataset}
 */
Dataset.prototype.addTasseledCap = function() {
  var coef = this.getTasseledCapCoefficients_();
  if (!coef) {
    throw new Error('Dataset does not support Tasseled Cap transformation.');
  }
  var srcBands = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];
  var dstBands = ['TC1', 'TC2', 'TC3', 'TC4', 'TC5', 'TC6'];

  // Figure out which bands correspond to the desired srcBands.
  var subset = this.lookupCommonBandNames(srcBands, this.collection_.first().bandNames());

  var output = this.collection_.map(function(image) {
    // Select the subset of bands needed and compute the transform.
    var tc = Bands.matrixMultiply(image.select(subset), coef, dstBands);
    return image.addBands(tc);
  });

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
  return this;
};

/**
 * Generic interface for applying cloud and shadow shadow masks to a
 * collection. Subclasses that support this operation should override this
 * method to provide a default implementation (e.g., CFMASK). Subclasses may
 * also specify additional arguments to control which methodology is used and
 * related parameters.
 *
 * Subclasses must return a new instance of the dataset with the masks
 * applied.
 */
Dataset.prototype.maskCloudsAndShadows = function() {
  throw new Error('Unimplemented method');
};

/**
 * Interface for fetching Tasseled Cap Coefficients.
 * Returns null so the caller can check for support.
 *
 * @protected
 * @return {?Array<Array<number>>} The coefficients specific to this dataset.
 */
Dataset.prototype.getTasseledCapCoefficients_ = function() {
  return null;
};

exports.Dataset = Dataset;
