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
  'B1': 'coastal',
  'B2': 'blue',
  'B3': 'green',
  'B4': 'red',
  'B5': 'nir',
  'B6': 'swir1',
  'B7': 'swir2',
  'B8': 'pan',
  'B9': 'cirrus',
  'B10': 'thermal1',
  'B11': 'thermal2'
};

var DEFAULT_VIS_PARAMS = {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.4};

/**
 * Returns a new Landsat 8 SR dataset instance.
 *
 * @constructor
 * @return {!Landsat8}
 */
var Landsat8 = function() {
  // Constructor safety.
  if (!(this instanceof Landsat8)) {
    return new Landsat8();
  }

  // TODO(gino-m): Accept `type` "SR"|"TOA".
  Dataset.call(
      this, ee.ImageCollection('LANDSAT/LC08/C01/T1_SR'), DEFAULT_VIS_PARAMS);
};

// Extend Dataset class. This causes Landsat8 to inherit all method and
// properties of Dataset.
Landsat8.prototype = Object.create(Dataset.prototype);

Landsat8.prototype.COMMON_BAND_NAMES = COMMON_BAND_NAMES;

/**
 * Masks clouds and shadows using relevant bits in the `pixel_qa` band. In
 * Landsat 8 datasets, the pixel QA bits are generated using the CFMASK
 * algorithm.
 *
 * Returns the dataset with the masks applied.
 *
 * @override
 * @return {!Landsat8}
 */
Landsat8.prototype.maskCloudsAndShadows = function() {
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
