/**
 * Copyright 2020 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Earth Engine Developer's Guide examples
 *   from 'Image collections - Compositing and mosaicking' page
 */

// [START earthengine__image_collections085__quality_mosaic]
// Define a function that scales and masks Landsat 8 surface reflectance images.
function prepSrL8(image) {
  // Develop masks for unwanted pixels (fill, cloud, cloud shadow).
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);

  // Apply the scaling factors to the appropriate bands.
  var getFactorImg = function(factorNames) {
    var factorList = image.toDictionary().select(factorNames).values();
    return ee.Image.constant(factorList);
  };
  var scaleImg = getFactorImg([
    'REFLECTANCE_MULT_BAND_.|TEMPERATURE_MULT_BAND_ST_B10']);
  var offsetImg = getFactorImg([
    'REFLECTANCE_ADD_BAND_.|TEMPERATURE_ADD_BAND_ST_B10']);
  var scaled = image.select('SR_B.|ST_B10').multiply(scaleImg).add(offsetImg);

  // Replace original bands with scaled bands and apply masks.
  return image.addBands(scaled, null, true)
    .updateMask(qaMask).updateMask(saturationMask);
}

// This function masks clouds and adds quality bands to Landsat 8 images.
var addQualityBands = function(image) {
  // Normalized difference vegetation index.
  var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']);
  // Image timestamp as milliseconds since Unix epoch.
  var millis = ee.Image(image.getNumber('system:time_start'))
                   .rename('millis').toFloat();
  return prepSrL8(image).addBands([ndvi, millis]);
};

// Load a 2014 Landsat 8 ImageCollection.
// Map the cloud masking and quality band function over the collection.
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterDate('2014-06-01', '2014-12-31')
  .map(addQualityBands);

// Create a cloud-free, most recent value composite.
var recentValueComposite = collection.qualityMosaic('millis');

// Create a greenest pixel composite.
var greenestPixelComposite = collection.qualityMosaic('nd');

// Display the results.
Map.setCenter(-122.374, 37.8239, 12); // San Francisco Bay
var vizParams = {bands: ['SR_B5', 'SR_B4', 'SR_B3'], min: 0, max: 0.4};
Map.addLayer(recentValueComposite, vizParams, 'Recent value composite');
Map.addLayer(greenestPixelComposite, vizParams, 'Greenest pixel composite');

// Compare to a cloudy image in the collection.
var cloudy = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140825');
Map.addLayer(cloudy, {bands: ['B5', 'B4', 'B3'], min: 0, max: 0.4}, 'Cloudy');
// [END earthengine__image_collections085__quality_mosaic]
