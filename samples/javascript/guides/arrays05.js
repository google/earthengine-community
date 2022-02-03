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
 *   from 'Arrays - Eigen analysis' section
 */

// Use these bands.
var bandNames = ee.List(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'B11']);

// Load a landsat 8 image and select the bands of interest.
var image = ee.Image('LANDSAT/LC08/C02/T1/LC08_044034_20140318')
  .select(bandNames);

// Display the input imagery and the region in which to do the PCA.
var region = image.geometry();
Map.centerObject(region, 10);
Map.addLayer(ee.Image().paint(region, 0, 2), {}, 'Region');
Map.addLayer(image, {bands: ['B5', 'B4', 'B2'], min: 0, max: 20000}, 'Original Image');

// Set an appropriate scale for Landsat data.
var scale = 30;

// Mean center the data to enable a faster covariance reducer
// and an SD stretch of the principal components.
var meanDict = image.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: region,
    scale: scale,
    maxPixels: 1e9
});
var means = meanDict.toImage(bandNames);
var centered = image.subtract(means);

// This helper function returns a list of new band names.
var getNewBandNames = function(prefix) {
  var seq = ee.List.sequence(1, bandNames.length());
  return seq.map(function(b) {
    return ee.String(prefix).cat(ee.Number(b).int());
  });
};

// This function accepts mean centered imagery, a scale and
// a region in which to perform the analysis.  It returns the
// Principal Components (PC) in the region as a new image.
// [START earthengine__arrays05__principal_components]
var getPrincipalComponents = function(centered, scale, region) {
  // Collapse the bands of the image into a 1D array per pixel.
  var arrays = centered.toArray();

  // Compute the covariance of the bands within the region.
  var covar = arrays.reduceRegion({
    reducer: ee.Reducer.centeredCovariance(),
    geometry: region,
    scale: scale,
    maxPixels: 1e9
  });

  // Get the 'array' covariance result and cast to an array.
  // This represents the band-to-band covariance within the region.
  var covarArray = ee.Array(covar.get('array'));

  // Perform an eigen analysis and slice apart the values and vectors.
  var eigens = covarArray.eigen();

  // This is a P-length vector of Eigenvalues.
  var eigenValues = eigens.slice(1, 0, 1);
  // This is a PxP matrix with eigenvectors in rows.
  var eigenVectors = eigens.slice(1, 1);

  // Convert the array image to 2D arrays for matrix computations.
  var arrayImage = arrays.toArray(1);

  // Left multiply the image array by the matrix of eigenvectors.
  var principalComponents = ee.Image(eigenVectors).matrixMultiply(arrayImage);

  // Turn the square roots of the Eigenvalues into a P-band image.
  var sdImage = ee.Image(eigenValues.sqrt())
      .arrayProject([0]).arrayFlatten([getNewBandNames('sd')]);

  // Turn the PCs into a P-band image, normalized by SD.
  return principalComponents
      // Throw out an an unneeded dimension, [[]] -> [].
      .arrayProject([0])
      // Make the one band array image a multi-band image, [] -> image.
      .arrayFlatten([getNewBandNames('pc')])
      // Normalize the PCs by their SDs.
      .divide(sdImage);
};
// [END earthengine__arrays05__principal_components]

// Get the PCs at the specified scale and in the specified region
var pcImage = getPrincipalComponents(centered, scale, region);

// Plot each PC as a new layer
for (var i = 0; i < bandNames.length().getInfo(); i++) {
  var band = pcImage.bandNames().get(i).getInfo();
  Map.addLayer(pcImage.select([band]), {min: -2, max: 2}, band);
}
