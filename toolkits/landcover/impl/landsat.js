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

var Bands = require('users/google/toolkits:landcover/impl/bands.js').Bands;
var Dataset = require('users/gorelick/toolkits:landcover/impl/dataset.js').Dataset;
var Util = require('users/gorelick/toolkits:landcover/impl/util.js').Util;

/**
 * Returns a new Landsat dataset instance.
 *
 * Landsat datasets are expected to contain 2 pieces of information specific
 *   to each sensor/collection type:
 *   1) The list of valid QA values.  When masking, any value not in this list is masked.
 *   2) A dictionary linking each input band name to its common name and scaling factors.
 *
 * While the individual masking, scaling and renaming functions are exposed, the expected
 * usage is actually to just call dataset.prepare(), which does all the recommended data
 * preparation.
 *
 * @constructor
 * @param {!ee.ImageCollection} collection The collection backing this dataset.
 * @return {!Landsat}
 */
var Landsat = function(collection) {
  // Constructor safety.
  if (!(this instanceof Landsat)) {
    return new Landsat(collection);
  }
  Dataset.call(this, collection);
};

// Extend Dataset class.
Landsat.prototype = Object.create(Dataset.prototype);

/** QA values indicating clear or water pixels, no clouds. */
Landsat.prototype.VALID_QA_VALUES = [];  // example: [322, 386, 324, 388, 836, 900]

/**
 * All bands in this dataset, in the 'expected' order.
 * Once bands have been renamed, this property is changed to reflect the new names.
 */
Landsat.prototype.bands = []; // example: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']

/** The 'common' band names and their scaling factors. */
Landsat.prototype.COMMON_BANDS = {}; // example: {'B1': {commonName: 'red', scaling: 0.1}, ...}

/**
 * Prepares the dataset for use by:
 * 1) Masking for clear pixels.
 * 2) Apply scaling factors.
 * 3) Renaming the bands to the common band names.
 *
 * @return {!Landsat}
 */
Landsat.prototype.prepare = function() {
  this.applyQaMask(this.VALID_QA_VALUES);
  this.applyScaling();
  this.renameCommonBands();
  return this;
 };

/**
 * Mask off any pixels that have a pixel_qa that isn't in qa_values.
 *
 * @param {Array<Number>=} qaValueList A list of valid QA values.
 * @return {!Landsat}
*/
Landsat.prototype.applyQaMask = function(qaValueList) {
  var validQA = ee.Image.constant(qaValueList || this.VALID_QA_VALUES);
  this.collection_ = this.collection_.map(function(image) {
    var mask = image.select('pixel_qa').eq(validQA).reduce('max');
    return image.updateMask(mask);
  });
  return this;
};

/**
 * Apply scaling factors from COMMON_BAND_NAMES
 *
 * @return {!Landsat}
 */
Landsat.prototype.applyScaling = function() {
  // Extract the scaling factors for the bands that have them.
  var scalingDict = Util.extractNamedValuesAsList(this.COMMON_BANDS, 'scaling');

  var scalingFactors = ee.Image.constant(scalingDict.values());
  this.collection_ = this.collection_.map(function(image) {
    var scaled = image.select(scalingDict.keys()).multiply(scalingFactors);
    // Overwrite the original bands with the scaled values.
    return image.addBands(scaled, null, true);
  });

  return this;
};

/**
 * Rename the bands identified in COMMON_BAND_NAMES and remove the rest.
 *
 * @return {!Landsat}
 */
Landsat.prototype.renameCommonBands = function() {
  var commonNames = Util.extractNamedValuesAsList(this.COMMON_BANDS, 'commonName');
  // We want to keep the band order, so pre-compute the final band names.
  var bandNames = ee.List(this.bands);
  // Get the list of bands that aren't in COMMON and remove them.
  var unchanged = bandNames.removeAll(commonNames.keys());
  var keep = bandNames.removeAll(unchanged);
  var finalNames = keep.map(function(n) {
    return commonNames.get(n);
  });

  this.collection_ = this.collection_.select(keep, finalNames);

  // Overwrite the list of bands so we know that this has been renamed.
  this.bands = finalNames;
  return this;
};

/**
 * Add the Tasseled Cap transformation to each image in the dataset.
 * See http://doi.org/10.1080/2150704X.2014.915434 for more information about Tasseled Cap.
 *
 * Each landsat subclass will have its own set of Tasseled Cap coefficients.
 * The output bands will be named: [TC1, TC2, TC3, TC4, TC5, TC6];
 *
 * @return {!Landsat}
 */
Landsat.prototype.addTasseledCap = function() {
  var coef = this.getTasseledCapCoefficients_();
  if (!coef) {
    throw new Error('Dataset does not support Tasseled Cap transformation.');
  }
  var srcBands = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];
  var dstBands = ['TC1', 'TC2', 'TC3', 'TC4', 'TC5', 'TC6'];

  var output = this.collection_.map(function(image) {
    // Select the subset of bands needed and compute the transform.
    var tc = Bands.matrixMultiply(image.select(srcBands), coef, dstBands);
    return image.addBands(tc);
  });

  this.collection_ = output;
  this.bands = ee.List(this.bands).cat(dstBands);
  return this;
};

exports.Landsat = Landsat;
