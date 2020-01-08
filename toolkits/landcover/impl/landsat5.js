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
 * Returns a new Landsat 5 SR dataset instance.
 *
 * @constructor
 * @param {!ee.ImageCollection} collection The collection backing this dataset.
 * @return {!Landsat5}
 */
var Landsat5 = function(collection) {
  // Constructor safety.
  if (!(this instanceof Landsat5)) {
    return new Landsat5(collection);
  }

  // TODO(gino-m): Accept `type` 'SR'|'TOA'.
  collection = collection || ee.ImageCollection('LANDSAT/LT05/C01/T1_SR');
  Landsat.call(this, collection);
};

// Extend Landsat class.
Landsat5.prototype = Object.create(Landsat.prototype);

/** QA values indicating clear or water pixels, no clouds. */
Landsat5.prototype.VALID_QA_VALUES = [66, 130, 68, 132];

/** All bands in this dataset */
Landsat5.prototype.bands = [
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7',
  'sr_atmos_opacity', 'sr_cloud_qa', 'pixel_qa', 'radsat_qa'
];

/** Common band names and scaling factors. */
Landsat5.prototype.COMMON_BANDS = {
  'B1': {commonName: 'blue', scaling: 0.0001},
  'B2': {commonName: 'green', scaling: 0.0001},
  'B3': {commonName: 'red', scaling: 0.0001},
  'B4': {commonName: 'nir', scaling: 0.0001},
  'B5': {commonName: 'swir1', scaling: 0.0001},
  'B6': {commonName: 'thermal1', scaling: 0.1},
  'B7': {commonName: 'swir2', scaling: 0.0001},
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
