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

var Composites =
    require('users/google/toolkits:landcover/impl/composites.js').Composites;
var Bands = require('users/google/toolkits:landcover/impl/bands.js').Bands;

/**
 * Returns a new dataset instance for an arbitrary image collection.
 *
 * @constructor
 * @param {string} id The id of the collection in the Earth Engine data
 *     catalog.
 * @param {!ee.data.ImageVisualizationParameters} defaultVisParams The
 *     parameters to be used when adding the resulting collection to a layer for
 *     visualization.
 * @return {!Dataset}
 */
var Dataset = function(id, defaultVisParams) {
  this.collection_ = ee.ImageCollection(id);
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
  this.collection_ = Composites.createTemporalComposites(
      this.collection_, startDate, count, interval, intervalUnits, reducer);
  return this;
};

/**
 * Computes a medioid composite by finding the median of one band
 * and returning the complete observation where that band is closest
 * to the median value.
 *
 * @param {string} band The name of the band which to
 *    select the median value.
 * @return {!ee.ImageCollection}
 */
Dataset.prototype.createMedioidComposite = function(band) {
  this.collection_ = ee.ImageCollection(
      [Composites.createMedioidComposite(this.collection_, band)]);
  return this;
};

/**
 * Computes the list of new band names to rename to common band names.
 * @param {!Array<string>} bandNames The input band names.
 * @return {!Array<string>} The modified band names in the same order as the
 *     input names.  Unknown bands are unmodified.
 *
 * @private
 */
Dataset.prototype.computeCommonBandNames_ = function(bandNames) {
  // Start with a lookup from oldname to newname using all the old names,
  // and augment it with the entries from this dataset's COMMON_BAND_NAMES.
  var commonNames = ee.Dictionary(bandNames.zip(bandNames).flatten());
  var lookup = commonNames.combine(this.COMMON_BAND_NAMES, true);
  return bandNames.map(function(name) {
    return lookup.get(name);
  });
};

/**
 * Add spectral indices to each image in the dataset.
 * @param {!string...} var_names The names of the spectral indexes to add.
 *     Must be string literals.
 * @return {!Dataset}
 */
Dataset.prototype.addBandIndices = function(var_names) {
  var indices = Array.prototype.slice.call(arguments);

  // Compute the transformation to common band names.
  var bandNames = this.collection_.first().bandNames();
  var commonNames = this.computeCommonBandNames_(bandNames);

  var output = this.collection_.map(function(image) {
    // Rename the bands and compute the spectral indices.
    var renamed = image.select(bandNames, commonNames);
    var bands = Bands.getSpectralIndices(renamed, indices);
    return image.addBands(bands);
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

exports.Dataset = Dataset;
