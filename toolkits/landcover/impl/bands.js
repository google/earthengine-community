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
 * Compute spectral indices for the given image.
 * Note: The image is expected to have the toolkit's "common" band names.
 *
 * @param {!ee.Image} image The input image.
 * @param {!Array<string>} indices The list of indices to create.
 * @return {!ee.Image} The computed indices.
 */

/**
 * Computes and adds the specified set of spectral indices to an image.
 *
 * @param {ee.Image} image The source image.
 * @param {!Array} indices The list of indices to calculate.
 * @return {ee.Image} The updated image.
 */
function getSpectralIndices(image, indices) {
  // We can't check the existence of the specified indices if they're EEObjects.
  if (!(indices instanceof ee.ComputedObject)) {
    // Check that all the specified indexes exist.
    indices.forEach(function(name) {
      if (!(name in SPECTRAL_INDEX_EXPRESSIONS)) {
        throw Error('Unrecognized spectral index: ' + name);
      }
    });
  }

  // TODO(gorelick): Change this to Dictionary.get once supported.
  return indices.map(function(name) {
    var expr = SPECTRAL_INDEX_EXPRESSIONS[name];
    return image.expression(expr, {b: image}).rename([name]);
  });
}

/**
 * Adds a band ('date') to each image in a collection containing the date of
 * the image in milliseconds since the epoch.
 *
 * @param {!ee.ImageCollection} collection
 * @return {!ee.ImageCollection}
 */
function addDateBand(collection) {
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
  return collection.map(function(img) {
    var date = img.date();
    var fYear = date.get('year').double().add(img.date().getFraction('year'));
    var band = ee.Image.constant(fYear).rename('fYear').double();
    return img.addBands(band);
  });
}

exports.Bands = {
  getSpectralIndices: getSpectralIndices,
  addDateBand: addDateBand,
  addDayOfYearBand: addDayOfYearBand,
  addFractionalYearBand: addFractionalYearBand
};
