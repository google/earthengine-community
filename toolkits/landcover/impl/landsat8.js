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

var Landsat = require('users/gorelick/toolkits:landcover/impl/landsat.js').Landsat;

/**
 * Returns a new Landsat 8 SR dataset instance.
 * @constructor
 * @param {!ee.ImageCollection} collection The collection backing this dataset.
 * @return {!Landsat8}
 */
var Landsat8 = function(collection) {
  // Constructor safety.
  if (!(this instanceof Landsat8)) {
    return new Landsat8(collection);
  }

  // TODO(gino-m): Accept `type` 'SR'|'TOA'.
  collection = collection || ee.ImageCollection('LANDSAT/LC08/C01/T1_SR');
  Landsat.call(this, collection);
};

// Extend Landsat class.
Landsat8.prototype = Object.create(Landsat.prototype);

/** QA values indicating clear or water pixels, no clouds. */
Landsat8.prototype.VALID_QA_VALUES = [322, 386, 324, 388, 836, 900];

/** All bands in this dataset */
Landsat8.prototype.bands = [
    'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'B11',
    'pixel_qa', 'sr_aerosol', 'radsat_qa'
];

/** The 'common' band names and their scaling factors. */
Landsat8.prototype.COMMON_BANDS = {
  'B1': {commonName: 'coastal', scaling: 0.0001},
  'B2': {commonName: 'blue', scaling: 0.0001},
  'B3': {commonName: 'green', scaling: 0.0001},
  'B4': {commonName: 'red', scaling: 0.0001},
  'B5': {commonName: 'nir', scaling: 0.0001},
  'B6': {commonName: 'swir1', scaling: 0.0001},
  'B7': {commonName: 'swir2', scaling: 0.0001},
  'B10': {commonName: 'thermal1', scaling: 0.1},
  'B11': {commonName: 'thermal2', scaling: 0.1},
};

/**
 * Returns the TasseledCap coefficients specific to Landsat 8.
 *
 * See: Muhammad Hasan Ali Baig, Lifu Zhang, Tong Shuai & Qingxi Tong (2014)
 * Derivation of a tasselled cap transformation based on Landsat 8 at-satellite
 * reflectance, Remote Sensing Letters, http://doi.org/10.1080/2150704X.2014.915434
 *
 * Coefficients are in the order: [blue, green, red, nir, swir1, swir2]
 * @override
 */
Landsat8.prototype.getTasseledCapCoefficients_ = function() {
  return [
    [0.3029, 0.2786, 0.4733, 0.5599, 0.5080, 0.1872], // Brightness
    [-0.2941, -0.2430, -0.5424, 0.7276, 0.0713, -0.160], // Greenness
    [0.1511, 0.1973, 0.3283, 0.3407, -0.7117, -0.4559], // Wetness
    [-0.8239, 0.0849, 0.4396, -0.0580, 0.2013, -0.2773], // TC4
    [-0.3294, 0.0557, 0.1056, 0.1855, -0.4349, 0.8085], // TC5
    [0.1079, -0.9023, 0.4119, 0.0575, -0.0259, 0.0252] // TC6
  ];
};

exports.Landsat8 = Landsat8;
