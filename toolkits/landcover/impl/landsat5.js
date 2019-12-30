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

var DEFAULT_VIS_PARAMS = {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.4};

/**
 * Returns a new Landsat 8 SR dataset instance.
 *
 * @constructor
 * @return {!Landsat5}
 */
var Landsat5 = function() {
  // Constructor safety.
  if (!(this instanceof Landsat5)) {
    return new Landsat5();
  }

  // TODO(gino-m): Accept `type` "SR"|"TOA".
  Dataset.call(
      this, ee.ImageCollection('LANDSAT/LT05/C01/T1_SR'), DEFAULT_VIS_PARAMS);
};

// Extend Dataset class. This causes Landsat5 to inherit all method and
// properties of Dataset.
Landsat5.prototype = Object.create(Dataset.prototype);

Landsat5.prototype.COMMON_BAND_NAMES = COMMON_BAND_NAMES;

/**
 * Masks clouds and shadows using relevant bits in the `pixel_qa` band. In
 * Landsat 8 datasets, the pixel QA bits are generated using the CFMASK
 * algorithm.
 *
 * Returns the dataset with the masks applied.
 *
 * @override
 * @return {!Landsat5}
 */
Landsat5.prototype.maskCloudsAndShadows = function() {
  this.collection_ = this.collection_.map(FMask.maskCloudsAndShadows);
  return this;
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
Landsat5.prototype.getTasseledCapCoefficients_ = function() {
  return [
        [0.2043, 0.4158, 0.5524, 0.5741, 0.3124, 0.2303],      //  Brightness
        [-0.1603, -0.2819, -0.4934, 0.7940, 0.0002, -0.1446],  //  Greenness
        [0.0315, 0.2021, 0.3102, 0.1594, 0.6806, -0.6109],     //  Wetness
        [-0.2117, -0.0284, 0.1302, -0.1007, 0.6529, -0.7078],  //  TC4
        [-0.8669, -0.1835, 0.3856, 0.0408, 0.1132, 0.2272],    //  TC5
        [0.3677, -0.8200, 0.4354, 0.0518, 0.0066, -0.0104],    //  TC6
      ];
};

exports.Landsat5 = Landsat5;
