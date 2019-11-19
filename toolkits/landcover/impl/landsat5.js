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
 * Returns a new Landsat 5 SR dataset instance.
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
 * Landsat 5 datasets, the pixel QA bits are generated using the CFMASK
 * algorithm.
 *
 * Returns the dataset with the masks applied.
 *
 * @override
 * @return {!Landsat5}
 */
Landsat5.prototype.maskCloudsAndShadows = function() {
  this.collection_ = this.collection_.map(Landsat5.maskCloudsAndShadows);
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
Landsat5.maskCloudsAndShadows = function(image) {
  // Named args not supported for single object arg function signatures.
  var qa = image.select(QA_BAND);
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(CLOUD_SHADOW_BIT_MASK)
                 .eq(0)
                 .and(qa.bitwiseAnd(CLOUD_BIT_MASK).eq(0));
  return image.updateMask(mask);
};

/**
 * Returns the TasseledCap coefficients specific to Landsat 5.
 * Crist, E. P., & Cicone, R. C. (1984). A physically-based transformation of
 * Thematic Mapper data---The TM Tasseled Cap. IEEE Transactions on Geoscience
 * and Remote sensing, (3), 256-263. https://doi.org/10.1109/TGRS.1984.350619
 *
 * Coefficients are in the order: [blue, green, red, nir, swir1, swir2]
 * @override
 */
Landsat5.prototype.getTasseledCapCoefficients_ = function() {
  return [
    [0.3037, 0.2793, 0.4743, 0.5585, 0.5082, 0.1863], // Brightness
    [-0.2848, -0.2435, -0.5436, 0.7243, 0.0840, -0.1800], // Greenness
    [0.1509, 0.1973, 0.3279, 0.3406, -0.7112, -0.4572], // Wetness
    [-0.8242, 0.0849, 0.4392, -0.0580, 0.2012, -0.2768], // TC4
    [-0.3280, 0.0549, 0.1075, 0.1855, -0.4357, 0.8085], // TC5
    [0.1084, -0.9022, 0.4120, 0.0573, -0.0251, 0.0238] // TC6
  ];
};


Landsat5.QA_BAND = QA_BAND;
Landsat5.CLOUD_SHADOW_BIT_MASK = CLOUD_SHADOW_BIT_MASK;
Landsat5.CLOUD_BIT_MASK = CLOUD_BIT_MASK;

exports.Landsat5 = Landsat5;

