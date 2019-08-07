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

var Composites = require('users/gmiceli/ee-lct:impl/composites.js').Composites;

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
  // NOTE: We will probably want to either keep track of what we do to the
  // ImageCollection, or accumulate operations and run them at the end. Keeping
  // it simple for now until we have a better sense of what we need.
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

exports.Dataset = Dataset;
