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
 * @fileoverview Static functions for band transformations.
 */

var NamedArgs = require('users/google/toolkits:landcover/impl/named-args.js').NamedArgs;

var SPECTRAL_INDEX_EXPRESSIONS = {
  // Note, this is a literal dictionary so we can check for the existence
  // of a given spectral index before sending the query.

  // TODO(gorelick): add real references.
  // https://landsat.usgs.gov/sites/default/files/documents/si_product_guide.pdf
  // https://www.harrisgeospatial.com/docs/BackgroundOtherIndices.html
  // https://medium.com/regen-network/remote-sensing-indices-389153e3d947

  // Normalized difference vegetation index
  'ndvi': '(b.nir - b.red) / (b.nir + b.red)',

  // Enhanced vegetation index
  'evi': '2.5 * ((b.nir - b.red) / (b.nir + 6 * b.red - 7.5 * b.blue + 1))',

  // Soil Adjusted Vegetation Index
  'savi': '((b.nir - b.red) / (b.nir + b.red + 0.5)) * (1.5)',

  // Modified Soil Adjusted Vegetation Index (MSAVI)
  'msavi':
      '(2 * b.nir + 1 - sqrt((2 * b.nir + 1)**2 - 8 * (b.nir - b.red))) / 2.0',

  // Normalized Difference Moisture Index (NDMI)
  'ndmi': '(b.nir - b.swir1) / (b.nir + b.swir1)',

  // Normalized Burn Ratio (NBR)
  'nbr': '(b.nir - b.swir2) / (b.nir + b.swir2)',
  'nbr2': '(b.swir1 - b.swir2) / (b.swir1 + b.swir2)',

  // Normalized Difference Water Index
  'ndwi': '(b.nir - b.swir1) / (b.nir + b.swir1)',

  // Modified Normalized Difference Water Index
  'mndwi': '(b.green - b.swir2) / (b.green + b.swir2)',

  // Normalized Difference Built-Up Index
  'ndbi': '(b.swir1 - b.nir) / (b.swir1 + b.nir)',

  // Normalized Difference Snow Index
  'ndsi': '(b.green - b.swir1) / (b.green + b.swir1)'
};


/**
 * Computes the specified set of spectral indices. Indices must be one of:
 *
 *   'ndvi', 'evi', 'savi', 'msavi', 'ndmi', 'nbr', 'nbr2', 'ndwi', 'mndwi',
 *   'ndbi', 'ndsi'
 *
 * This function assumes that the image bands are using the 'common' naming.
 *
 * @param {ee.Image} image The source image.
 * @param {!Array<string>} indices The list of indices to calculate.
 * @return {!ee.Image} A new image containing the calculated bands.
 */
function getSpectralIndices(image, indices) {
  var args = NamedArgs.extractFromFunction(getSpectralIndices, arguments);
  image = args.image;
  indices = args.indices;

  return ee.Image(indices.map(function(name) {
    var expr = SPECTRAL_INDEX_EXPRESSIONS[name];
    // Check that the specified indices exist.
    if (!expr) {
      throw Error('Unrecognized spectral index: ' + name);
    }
    return image.expression(expr, {b: image}).rename([name]);
  }));
}

/**
 * Adds a band ('date') to each image in a collection containing the date of
 * the image in milliseconds since the epoch.
 *
 * @param {!ee.ImageCollection} collection
 * @return {!ee.ImageCollection}
 */
function addDateBand(collection) {
  var args = NamedArgs.extractFromFunction(addDateBand, arguments);
  collection = args.collection;
  return collection.map(function(img) {
    var date = ee.Image.constant(img.date().millis())
        .rename('date').long();
    return img.addBands(date);
  });
}

/**
 * Adds a band ('doy') to each image in a collection containing the day of
 * year of the image.
 *
 * @param {!ee.ImageCollection} collection
 * @return {!ee.ImageCollection}
 */
function addDayOfYearBand(collection) {
  var args = NamedArgs.extractFromFunction(addDayOfYearBand, arguments);
  collection = args.collection;
  return collection.map(function(img) {
    var doy = ee.Image.constant(img.date().getRelative('day', 'year'))
        .rename('doy').int();
    return img.addBands(doy);
  });
}

/**
 * Adds a band (fYear) to each image in a collection containing the fractional
 * year (year + doy/365) of the image.
 *
 * @param {!ee.ImageCollection} collection
 * @return {!ee.ImageCollection}
 */
function addFractionalYearBand(collection) {
  var args = NamedArgs.extractFromFunction(addFractionalYearBand, arguments);
  collection = args.collection;
  return collection.map(function(img) {
    var date = img.date();
    var fYear = date.get('year').double().add(img.date().getFraction('year'));
    var band = ee.Image.constant(fYear).rename('fYear').double();
    return img.addBands(band);
  });
}


/**
 * Compute a matrix multiply between the given image and a set of coefficients
 * such as an eigenvector rotation or a Tasseled Cap transformation.
 *
 * The input image is expected to have the same number of bands as the width of
 * the coefficients matrix.
 *
 * @param {!ee.Image} image The image on which to compute the transformation.
 * @param {!Array<!Array<number>>} coef The matrix to apply to the image.
 * @param {Array<string>=} bandNames An optional list of output band names.
 * @return {!ee.Image} The transformed bands.
 */
function matrixMultiply(image, coef, bandNames) {
  // Create some default band names if none were specified.
  bandNames = bandNames || generateBandNames('mmult', image.bandNames().length());

  // Make an Array Image with a 2-D Array per pixel.
  var arrayImage = image.toArray().toArray(1);
  return ee.Image(ee.Array(coef))
      .matrixMultiply(arrayImage)
      .arrayProject([0]) // get rid of the extra dimensions
      .arrayFlatten([bandNames]);
}

/**
 * Generate a series of band names of the form prefixN.
 * @param {!string} prefix The prefix to prepend.
 * @param {!number} count How many bands to generate, starting from 0.
 * @return {*}
 */
function generateBandNames(prefix, count) {
  return ee.List.sequence(1, count).map(function(n) {
    return ee.Number(n).format(ee.String(prefix).cat('%d'));
  });
}

exports.Bands = {
  getSpectralIndices: getSpectralIndices,
  addDateBand: addDateBand,
  addDayOfYearBand: addDayOfYearBand,
  addFractionalYearBand: addFractionalYearBand,
  matrixMultiply: matrixMultiply
};
