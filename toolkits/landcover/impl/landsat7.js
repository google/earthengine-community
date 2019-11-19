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

var Dataset = require('users/google/toolkits:landcover/impl/dataset.js').Dataset;

var COMMON_BAND_NAMES = {
  'B1': 'blue',
  'B2': 'green',
  'B3': 'red',
  'B4': 'nir',
  'B5': 'swir1',
  'B6': 'thermal',
  'B7': 'swir2'
};

var DEFAULT_VIS_PARAMS = {bands: ['B3', 'B2', 'B1'], min: 0, max: 3000, gamma: 1.4};
var CLOUD_SHADOW_BIT_MASK = 1 << 3;
var CLOUD_BIT_MASK = 1 << 5;
var QA_BAND = 'pixel_qa';

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
  this.collection_ = this.collection_.map(Landsat7.maskCloudsAndShadows);
  return this;
};

/**
 * Masks clouds and shadows in the specified image using relevant bits in the
 * `pixel_qa` band generated by the CFMASK algorithm.
 *
 * Returns the image with the mask applied.
 *
 * @param {!ee.Image} image The image to be masked.
 * @return {!ee.Image}
 */
Landsat7.maskCloudsAndShadows = function(image) {
  // Named args not supported for single object arg function signatures.
  var qa = image.select(QA_BAND);
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(CLOUD_SHADOW_BIT_MASK)
                 .eq(0)
                 .and(qa.bitwiseAnd(CLOUD_BIT_MASK).eq(0));
  return image.updateMask(mask);
};

/**
 * Returns the TasseledCap coefficients specific to Landsat 7.
 * Huang, C., Wylie, B., Yang, L., Homer, C., & Zylstra, G. (2002). Derivation
 * of a tasselled cap transformation based on Landsat 7 at-satellite
 * reflectance. International journal of remote sensing, 23(8), 1741-1748.
 * https://doi.org/10.1080/01431160110106113
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


Landsat7.QA_BAND = QA_BAND;
Landsat7.CLOUD_SHADOW_BIT_MASK = CLOUD_SHADOW_BIT_MASK;
Landsat7.CLOUD_BIT_MASK = CLOUD_BIT_MASK;

exports.Landsat7 = Landsat7;