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
 * Returns a new Landsat 7 SR dataset instance.
 *
 * @constructor
 * @param {!ee.ImageCollection} collection The collection backing this dataset.
 * @return {!Landsat7}
 */
var Landsat7 = function(collection) {
  // Constructor safety.
  if (!(this instanceof Landsat7)) {
    return new Landsat7(collection);
  }

  // TODO(gino-m): Accept `type` 'SR'|'TOA'.
  collection = collection || ee.ImageCollection('LANDSAT/LE07/C01/T1_SR');
  Landsat.call(this, collection);
};

// Extend Landsat class.
Landsat7.prototype = Object.create(Landsat.prototype);

/** QA values indicating clear or water pixels, no clouds. */
Landsat7.prototype.VALID_QA_VALUES = [66, 130, 68, 132];

/** All bands in this dataset */
Landsat7.prototype.bands = [
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7',
  'sr_atmos_opacity', 'sr_cloud_qa', 'pixel_qa', 'radsat_qa'
];

Landsat7.prototype.COMMON_BANDS = {
  'B1': {commonName: 'blue', scaling: 0.0001},
  'B2': {commonName: 'green', scaling: 0.0001},
  'B3': {commonName: 'red', scaling: 0.0001},
  'B4': {commonName: 'nir', scaling: 0.0001},
  'B5': {commonName: 'swir1', scaling: 0.0001},
  'B6': {commonName: 'thermal1', scaling: 0.1},
  'B7': {commonName: 'swir2', scaling: 0.0001},
};

/**
 * Returns the TasseledCap coefficients specific to Landsat 7.
 *
 * See: Muhammad Hasan Ali Baig, Lifu Zhang, Tong Shuai & Qingxi Tong (2014)
 * Derivation of a tasselled cap transformation based on Landsat 8 at-satellite
 * reflectance, Remote Sensing Letters, http://doi.org/10.1080/2150704X.2014.915434
 *
 * Coefficients are in the order: [blue, green, red, nir, swir1, swir2]
 * @override
 */
Landsat7.prototype.getTasseledCapCoefficients_ = function() {
  return [
    [0.3561, 0.3972, 0.3904, 0.6966, 0.2286, 0.1596], // Brightness
    [-0.3344, -0.3544, -0.4556, 0.6966, -0.0242, -0.2630], // Greenness
    [0.2626, 0.2141, 0.0926, 0.0656, -0.7629, -0.5388], // Wetness
    [0.0805, -0.0498, 0.1950, -0.1327, 0.5752, -0.7775], // TC4
    [-0.7252, -0.0202, 0.6683, 0.0631, -0.1494, -0.0274], // TC5
    [0.4000, -0.8172, 0.3832, 0.0602, -0.1095, 0.0985] // TC6
  ];
};

exports.Landsat7 = Landsat7;
