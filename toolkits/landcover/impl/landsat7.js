/**
 * @license
 * Copyright 2019 The Google Earth Engine Community Authors
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

var Dataset = require('users/google/toolkits:landcover/impl/dataset.js').Dataset;
var FMask = require('users/google/toolkits:landcover/impl/fmask.js');

var COMMON_BAND_NAMES = {
  'B1': 'blue',
  'B2': 'green',
  'B3': 'red',
  'B4': 'nir',
  'B5': 'swir1',
  'B6': 'thermal',
  'B7': 'swir2',
  'B8': 'pan',
};

var DEFAULT_VIS_PARAMS = {bands: ['B3', 'B2', 'B1'], min: 0, max: 3000, gamma: 1.4};

/**
 * Returns a new Landsat 7 SR dataset instance.
 *
 * @constructor
 * @return {!Landsat7}
 */
var Landsat7 = function() {
  // Constructor safety.
  if (!(this instanceof Landsat7)) {
    return new Landsat7();
  }

  // TODO(gino-m): Accept `type` "SR"|"TOA".
  Dataset.call(
      this, ee.ImageCollection('LANDSAT/LE07/C01/T1_SR'), DEFAULT_VIS_PARAMS);
};

// Extend Dataset class. This causes Landsat7 to inherit all method and
// properties of Dataset.
Landsat7.prototype = Object.create(Dataset.prototype);

Landsat7.prototype.COMMON_BAND_NAMES = COMMON_BAND_NAMES;

/**
 * Masks clouds and shadows using relevant bits in the `pixel_qa` band. In
 * Landsat 7 datasets, the pixel QA bits are generated using the CFMASK
 * algorithm.
 *
 * Returns the dataset with the masks applied.
 *
 * @override
 * @return {!Landsat7}
 */
Landsat7.prototype.maskCloudsAndShadows = function() {
  this.collection_ = this.collection_.map(FMask.maskCloudsAndShadows);
  return this;
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
