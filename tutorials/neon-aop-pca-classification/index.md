---
title: Dimensionality Reduction and Land Cover Classification with NEON Hyperspectral and Canopy Height Model Data
description: Learn how to reduce NEON's 426-band airborne hyperspectral reflectance data to a compact set of principal components using memory-efficient representative sampling, then combine those components with a lidar-derived Canopy Height Model to classify land cover with a Random Forest classifier.
author: NEONScience
tags: hyperspectral, neon, pca, classification
date_published: 2026-04-17
---
<!--
Copyright 2023 The Google Earth Engine Community Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

[Open In Code Editor](https://code.earthengine.google.com/?accept_repo=users/bhass/gee-community-tutorial)

The principal components transform is a spectral rotation that takes spectrally correlated image data and outputs uncorrelated bands. In this tutorial, you will learn how to apply Principal Component Analysis (PCA) to reduce the National Ecological Observatory Network's (NEON's) airborne reflectance data from hundreds of bands to a compact set of uncorrelated components. You will learn to build a reproducible, memory‑efficient PCA workflow using representative sampling and then run a random forest classification on the PCA‑transformed data along with NEON's lidar-derived Canopy Height Model (CHM).

## Context

[NEON](https://developers.google.com/earth-engine/datasets/publisher/neon-prod-earthengine), the NSF-funded National Ecological Observatory Network, provides 1 meter resolution airborne datasets across the United States, including 426 band [hyperspectral data](https://developers.google.com/earth-engine/datasets/catalog/projects_neon-prod-earthengine_assets_HSI_REFL_002) and lidar-derived data, including [Canopy Height Model](https://developers.google.com/earth-engine/datasets/catalog/projects_neon-prod-earthengine_assets_CHM_001). Click on the links to learn more about [NEON](https://www.neonscience.org/)] and NEON's [Airborne Remote Sensing](https://www.neonscience.org/data-collection/airborne-remote-sensing) program, which provide open datasets ideal for pairing with satellite data.

## Instructions

Outline of what this tutorial will cover:

1. Read in the NEON Hyperspectral dataset, assess weather quality and select the AOI
2. Compute Principal Component Analysis on reflectance data using representative sampling
3. Build a feature stack including the principal copmonents and CHM, classify land cover with random forest, and assess results

### 1. Read in the NEON Hyperspectral Image Collection and select the Area of Interest

[Part 1 - Open In Code Editor](https://code.earthengine.google.com/6ced0612c8b83c07563aeaf838758d5b)

Retrieve the [NEON Surface Bidirectional Reflectance](https://developers.google.com/earth-engine/datasets/catalog/projects_neon-prod-earthengine_assets_HSI_REFL_002) as an `ee.ImageCollection` and select the site and date. This tutorial will use the [Smithsonian Environmental Research Center NEON / SERC](https://www.neonscience.org/field-sites/serc) site as an example. NEON airborne data are typically collected at 1000 m Above Ground Level (AGL), and flights are targetted during cloud-free conditions, if possible. Unlike satellite data, the aircraft is collecting below the clouds, which means cloud filtering is not an option. Instead, NEON reflectance data include a Weather Quality Indicator (WQI) band, which indicates percent cloud cover, as recorded by flight operators collecting the data. NEON recommends using < 10% cloud cover data, when possible. In this example, we'll map the cloud cover conditions for the SERC 2022 collection and select an area that was collected in the best weather conditions that encompasses a variety of land cover types. This AOI will be used in the rest of the lesson.

```js
// ------------------------------------------------------------
// Script 1. Load NEON bidirectional reflectance, inspect weather QA,
// and define the area of interest.
// ------------------------------------------------------------

// Display all available images for the NEON bidirectional reflectance image collection
// at the Smithsonian Environmental Research Center (SERC) site
// Find info about all of NEON's sites here: https://www.neonscience.org/field-sites
var reflCol = ee.ImageCollection('projects/neon-prod-earthengine/assets/HSI_REFL/002')
                .filterMetadata('NEON_SITE', 'equals', 'SERC')

// Display available images in the HSI_REFL/002 Image Collection at SERC
print('NEON Bidirectional Reflectance Images at the SERC site:');
print(reflCol.aggregate_array('system:index'));

// Load SERC reflectance data for 2022
var reflImage = reflCol
  .filterDate('2022-01-01', '2022-12-31')
  .filterMetadata('NEON_SITE', 'equals', 'SERC')
  .first();

print('Reflectance image', reflImage);

// Select QA bands and the weather quality layer
var qaBands = reflImage.select('[^B].*');
var weatherQa = reflImage.select('Weather_Quality_Indicator');

print('QA bands', qaBands);
print('Weather QA values: 1 = <10% cloud cover, 2 = 10-50%, 3 = >50%');

// Keep only clear-weather pixels
var clearMask = weatherQa.eq(1);
var clearRefl = reflImage.updateMask(clearMask);

// Display layers
Map.centerObject(reflImage, 12);

// Weather QA map (Green=<10% clouds, Yellow = 10-50% clouds, Red = >50% clouds)
Map.addLayer(
  weatherQa,
  {min: 1, max: 3, palette: ['green', 'yellow', 'red'], opacity: 0.3},
  'Weather QA',
  0 // don't display this layer, by default (can toggle in the layers menu)
);

// Reflectance RGB (<10% cloud cover only)
Map.addLayer(reflImage, {bands: ['B053','B035','B019'], min: 103, max: 1160}, 'Reflectance RGB');

// Define area of interest
// Select area within the <10% cloud cover that encompasses some different land cover types
var aoi = ee.Geometry.Rectangle([-76.5413, 38.8624, -76.5183, 38.8968]);

Map.addLayer(aoi, {color: 'white', opacity: 0.25}, 'AOI');
// Map.addLayer(rgbImage.clip(aoi), {min: 103, max: 1160}, 'AOI RGB');

// display the citation information (included as a property)
var reflProperties = reflImage.toDictionary();

// data citation - see https://www.neonscience.org/data/guidelines-policies/citing
var reflCitation = reflProperties.select(['CITATION']);
print('Data Citation:', reflCitation)
```

![SERC 2022 WQI](serc-wqi-map.png)

![SERC reflectance data with AOI](serc-refl-aoi.png)

### 2. Compute Principal Component Analysis on reflectance data using representative sampling

[Part 2 - Open In Code Editor](https://code.earthengine.google.com/36903e32696fc18c4bdb157f3e3c88ae)

With 426 spectral bands, computing PCA statistics across every pixel in the AOI would be prohibitively expensive in Earth Engine. Instead, this script draws a small representative sample of pixels — here 5,000 points at 1 m resolution — and uses that sample to estimate the band means and covariance matrix. The sample geometry (a convex hull of the sampled points) is passed to `reduceRegion` to limit computation to just those locations. The resulting covariance matrix is the same 426 × 426 array you would get from a full-scene computation, but derived from a fraction of the pixels, which keeps memory and compute time manageable.

The `calcImagePca` function carries out four steps:
1. Convert the multi-band image to an array image for matrix algebra.
2. Subtract per-band means (computed over the sample) to center the data.
3. Compute the covariance matrix of the centered array over the sample geometry.
4. Compute eigenvalues and eigenvectors, then project the full image onto the eigenvectors to produce the PC bands.

Note that the statistics (steps 2–3) are estimated from the sample, but the projection (step 4) is applied to every pixel in the clipped AOI image — so the output PCA image covers the full AOI at full 1 m resolution.

```js
// ------------------------------------------------------------
// Script 2. Compute principal components from NEON hyperspectral
// imagery over the AOI, and display a representative sample of
// pixels used to guide the PCA calculation.
// ------------------------------------------------------------

// Define area of interest
var aoi = ee.Geometry.Rectangle([-76.5413, 38.8624, -76.5183, 38.8968]);

// Analysis settings.
var analysisScale = 1;
var statsScale = 1;
var numberOfSamples = 5000; // sample count should be at least several times larger than band count (426)
var numComponents = 5;

// ------------------------------------------------------------
// Load and prepare hyperspectral imagery
// ------------------------------------------------------------

// Load NEON reflectance for SERC in 2022 and clip to the AOI.
var reflImage = ee.ImageCollection('projects/neon-prod-earthengine/assets/HSI_REFL/002')
  .filterMetadata('NEON_SITE', 'equals', 'SERC')
  .filterDate('2022-01-01', '2022-12-31')
  .first()
  .clip(aoi);

// Create a natural-color RGB composite for visualization.
// B053 ≈ red, B035 ≈ green, B019 ≈ blue.
var reflRgb = reflImage.select(['B053', 'B035', 'B019']);

// Display the AOI and RGB image.
Map.centerObject(aoi, 13);
Map.addLayer(reflRgb, {min: 103, max: 1160}, 'Reflectance RGB');
// Map.addLayer(aoi, {color: 'white'}, 'AOI', false);

// ------------------------------------------------------------
// Draw a representative sample of pixels
// ------------------------------------------------------------

// Sample a subset of pixels across the AOI. These points are used
// as a representative sample of the scene and can be displayed in
// the lesson to show where PCA statistics are being drawn from.
var samplePoints = reflImage.sample({
  region: aoi,
  scale: analysisScale,
  numPixels: numberOfSamples,
  seed: 1,
  geometries: true
});

// Add sample points as a map layer for the lesson figure.
Map.addLayer(
  samplePoints,
  {color: 'white'},
  'Representative sample points',
  false
);

print('Sample points', samplePoints.limit(10));
```

![PCA Representative Samples](pca-samples.png)
The white points show where spectral statistics will be drawn from. A well-distributed sample like this — spread across forest, open water and man-made surfaces, helps the covariance matrix capture the full range of spectral variability in the scene, which in turn produces more representative eigenvectors. Next define some functions that will compute the PCA.

```javascript
// ------------------------------------------------------------
// Helper to generate PC band names: PC1, PC2, PC3, ...
// ------------------------------------------------------------
function getNewBandNames(prefix, num) {
  return ee.List.sequence(1, num).map(function(i) {
    return ee.String(prefix).cat(ee.Number(i).int().format());
  });
}

// ------------------------------------------------------------
// Function to perform Principal Component Analysis
// ------------------------------------------------------------

// This function:
// 1. computes the mean reflectance for each band
// 2. centers the image by subtracting the band means
// 3. computes the covariance matrix
// 4. projects the image into PCA space
function calcImagePca(image, numComponents, samplePoints, scale) {
  var bandNames = image.bandNames();
  var region = samplePoints.geometry();

  // Convert the image into an array for matrix operations.
  var arrayImage = image.toArray();

  // Compute the mean value of each band.
  var meanDict = image.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: region,
    scale: scale,
    maxPixels: 1e13,
    bestEffort: true,
    tileScale: 16
  });

  // Convert band means into an image and center the data.
  var meanImage = ee.Image.constant(meanDict.values(bandNames)).rename(bandNames);
  var meanArray = meanImage.toArray().arrayRepeat(0, 1);
  var meanCentered = arrayImage.subtract(meanArray);

  // Compute the covariance matrix from the centered image.
  var covar = meanCentered.reduceRegion({
    reducer: ee.Reducer.centeredCovariance(),
    geometry: region,
    scale: scale,
    maxPixels: 1e13,
    bestEffort: true,
    tileScale: 16
  });

  // Compute eigenvalues and eigenvectors.
  var covarArray = ee.Array(covar.get('array'));
  var eigens = covarArray.eigen();
  var eigenVectors = eigens.slice(1, 1);

  // Project the centered image onto the eigenvectors.
  var principalComponents = ee.Image(eigenVectors)
    .matrixMultiply(meanCentered.toArray(1));

  // Return the first n principal components.
  return principalComponents
    .arrayProject([0])
    .arraySlice(0, 0, numComponents)
    .arrayFlatten([getNewBandNames('PC', numComponents)]);
}

// ------------------------------------------------------------
// Apply PCA
// ------------------------------------------------------------
var pcaImage = calcImagePca(
  reflImage,
  numComponents,
  samplePoints,
  statsScale
);

print('PCA image', pcaImage);

// Print variance explained by each of the top PCs.
// Eigenvalues from the covariance matrix give the variance each PC captures.
var bandNames = reflImage.bandNames();
var meanDict = reflImage.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: samplePoints.geometry(),
  scale: statsScale,
  maxPixels: 1e13,
  bestEffort: true,
  tileScale: 16
});
var meanArray = ee.Image.constant(meanDict.values(bandNames))
  .rename(bandNames).toArray().arrayRepeat(0, 1);
var meanCentered = reflImage.toArray().subtract(meanArray);
var covar = meanCentered.reduceRegion({
  reducer: ee.Reducer.centeredCovariance(),
  geometry: samplePoints.geometry(),
  scale: statsScale,
  maxPixels: 1e13,
  bestEffort: true,
  tileScale: 16
});
var eigenValues = ee.Array(covar.get('array')).eigen()
  .slice(1, 0, 1).project([0]);
var totalVariance = eigenValues.reduce(ee.Reducer.sum(), [0]).get([0]);
var pctEach = eigenValues.slice(0, 0, numComponents)
  .divide(totalVariance).multiply(100);
var pctCumulative = eigenValues.slice(0, 0, numComponents)
  .accum(0).divide(totalVariance).multiply(100);

print('Variance explained by top PCs', ee.Dictionary({
  pctEach: pctEach,
  pctCumulative: pctCumulative
}));
```

The variance output lets you confirm how much spectral information the top PCs retain. For this AOI, you should see something close to the following:

```
pctEach:       [87.1, 9.2, 1.5, 0.6, 0.5]
pctCumulative: [87.1, 96.4, 97.9, 98.5, 99.0]
```

PC1 alone captures roughly 87% of the total variance — reflecting the dominant brightness gradient across vegetation, soil, and man-made surfaces in the scene. PC2 adds another ~9%, and by PC5, the cumulative variance is already around 99%, which means five principal components preserve nearly all the spectral structure of the original 426 bands. The remaining bands contribute mostly sensor noise and correlated atmospheric effects. This steep drop-off is typical of hyperspectral data, where adjacent bands are highly correlated, and is exactly why PCA is an effective dimensionality-reduction step before classification.

### 3. Random Forest Classification 

#### 3a. Build a standardized feature stack using the top principal components + CHM

[Part 3 - Open In Code Editor](https://code.earthengine.google.com/63116985fb032aba03adf6f3da967fa1)

```js
// ------------------------------------------------------------
// Supervised classification from hand-labeled training areas
// ------------------------------------------------------------

// Define AOI and the feature stack (PCA + CHM)
var aoi = ee.Geometry.Rectangle([-76.5413, 38.8624, -76.5183, 38.8968]);

// Hyperspectral reflectance image for visual interpretation.
var reflImage = ee.Image(
  'projects/neon-prod-earthengine/assets/HSI_REFL/002/2022_SERC_6'
).clip(aoi);

// CHM image from the same airborne campaign.
var chmImage = ee.Image(
  'projects/neon-prod-earthengine/assets/CHM/001/2022_SERC_6'
).rename('CHM').clip(aoi);

// Principal components image from hyperspectral data.
var pcImage = ee.Image(
  'projects/neon-sandbox-dataflow-ee/assets/2022_SERC_6_PCA'
);

// Select the PC bands you want to use
// Could change to use only the top 3 PCs, which explain ~98% of the variance
var pcBands = ['PC1', 'PC2', 'PC3', 'PC4', 'PC5'];

// Stack PCA + CHM into one multiband image.
var featureStack = pcImage.select(pcBands).addBands(chmImage);

print('Feature stack', featureStack);
print('Feature stack band names', featureStack.bandNames());

// Visualize RGB composite.
Map.centerObject(aoi, 14);

Map.addLayer(
  featureStack,
  {bands: 'CHM', min: 0, max: 30},
  'Feature Stack'
);

Map.addLayer(
  reflImage,
  {bands: ['B053', 'B035', 'B019'], min: 103, max: 1160},
  'RGB Reflectance'
);
```

![Feature Stack](feature-stack.png)

#### 3b. Select polygons representing different land cover types

To train the classifier, you need labeled examples of each land cover type. Here, five classes are defined: water, man-made surfaces, stressed vegetation, low vegetation, and forest. Each class is represented by two small polygons drawn over areas that are clearly identifiable in the RGB reflectance image and the CHM. The polygons are given a numeric `class` property and merged into a single `FeatureCollection` that will be passed to `sampleRegions` in the next step. If you want to experiment with your own training areas, you can draw new polygons directly in the Code Editor's geometry tools and assign them the same `class` values.

```js
// ------------------------------------------------------------
// Define training polygons
// Draw these in the Code Editor or replace the placeholders below.
// Each polygon needs a numeric class property (1-5).
// ------------------------------------------------------------

var water = ee.FeatureCollection([
  ee.Feature(
    ee.Geometry.MultiPolygon(
      [[[[-76.5282, 38.8928],[-76.5282, 38.8923],[-76.5275, 38.8923],[-76.5275, 38.8928]]],
      [[[-76.5255, 38.8869],[-76.5255, 38.8853],[-76.5232, 38.8853],[-76.5232, 38.8869]]]]),
      {class: 1})]);
      
var manMade = ee.FeatureCollection([
  ee.Feature(
    ee.Geometry.MultiPolygon(
      [[[[-76.5258, 38.8922],[-76.5258, 38.8919],[-76.5254, 38.8919],[-76.5254, 38.8922]]],
      [[[-76.5196, 38.8873],[-76.5196, 38.8872],[-76.5195, 38.8872],[-76.5195, 38.8873]]]]),
      {class: 2})]);      

var stressedVeg = ee.FeatureCollection([
  ee.Feature(
    ee.Geometry.MultiPolygon(
      [[[[-76.5370, 38.8723],[-76.5370, 38.8714],[-76.5359, 38.8714],[-76.5359, 38.8723]]],
      [[[-76.5311, 38.8719],[-76.5311, 38.8711],[-76.5302, 38.8711],[-76.5302, 38.8719]]]]),
      {class: 3})]);

var lowVeg = ee.FeatureCollection([
  ee.Feature(
    ee.Geometry.MultiPolygon(
      [[[[-76.5276, 38.8893],[-76.5276, 38.8887],[-76.5269, 38.8887],[-76.5269, 38.8893]]],
      [[[-76.5325, 38.8750],[-76.5325, 38.8744],[-76.5317, 38.8744],[-76.5317, 38.8750]]]]),
      {class: 4})]);

var forest = ee.FeatureCollection([
  ee.Feature(
    ee.Geometry.MultiPolygon(
      [[[[-76.5373, 38.8765],[-76.5373, 38.8754],[-76.5359, 38.8754],[-76.5359, 38.8765]]],
      [[[-76.5334, 38.8724],[-76.5334, 38.8712],[-76.5320, 38.8712],[-76.5320, 38.8724]]]]),
      {class: 5})]);

var trainingPolygons = water
  .merge(manMade)
  .merge(stressedVeg)
  .merge(lowVeg)
  .merge(forest);

Map.addLayer(trainingPolygons, {color: 'white', opacity: 0.25}, 'Training polygons');
```

![Training Polygons](training-polygons.png)

#### 3c. Classification

With training polygons defined, this script samples the feature stack (PC1–PC5 + CHM) at each polygon location, splits the samples 70/30 into training and validation sets, and trains a Random Forest classifier with 100 trees. Random Forest is a good default choice here because it handles the mix of PCA-derived bands and the structurally different CHM band without requiring feature scaling, and it is robust to the class imbalance typical of land cover datasets where for example water and forest pixels far outnumber man-made pixels. The trained classifier is then applied to the full AOI to produce a wall-to-wall land cover map.

```js
// ------------------------------------------------------------
// Random Forest Classification
// 1. Sample the feature stack at the training polygons
// sampleRegions copies the class property into the sampled pixels.
// ------------------------------------------------------------
var trainingSample = featureStack.sampleRegions({
  collection: trainingPolygons,
  properties: ['class'],
  scale: 1,
  geometries: true
});

// ------------------------------------------------------------
// 2. Add a random column for train/validation split
// ------------------------------------------------------------
var sampled = trainingSample.randomColumn('random', 42);

var trainSet = sampled.filter(ee.Filter.lt('random', 0.7));
var testSet  = sampled.filter(ee.Filter.gte('random', 0.7));

// ------------------------------------------------------------
// 3. Train a Random Forest classifier
// ------------------------------------------------------------
var classifier = ee.Classifier.smileRandomForest({
  numberOfTrees: 100,
  seed: 42
}).train({
  features: trainSet,
  classProperty: 'class',
  inputProperties: featureStack.bandNames()
});


// ------------------------------------------------------------
// 4. Classify the full image
// classes are 1. water, 2. man made, 3. stressed veg, 4. low veg, 5. forest
// ------------------------------------------------------------
var classified = featureStack.classify(classifier).rename('class');

Map.addLayer(
  classified.clip(aoi),
  {
    min: 1,
    max: 5,
    palette: ['lightblue', 'grey', 'orange', 'lightgreen', 'darkgreen']
  },
  'Supervised classes'
);
```

![Classification](supervised-classes.png)

#### 3d. Assess the classification results

The 30% validation set held back during training is used here to evaluate how well the classifier generalizes to new pixels that weren't used in the training. Running those pixels through the trained model and comparing predicted labels against known labels produces a confusion matrix — a table where rows represent true classes and columns represent predicted classes. Diagonal cells are correct predictions; off-diagonal cells are errors.

Three summary metrics are printed:

- **Overall accuracy** — the fraction of all validation pixels that were correctly classified. Straightforward but can be misleading if classes are imbalanced (e.g., if forest covers 80% of the AOI, a classifier that predicts "forest" everywhere would score 80% overall accuracy while being useless for other classes).
- **Producer's accuracy** — for each class, the fraction of true pixels of that class that were correctly identified. Low producer's accuracy for a class means the classifier is frequently missing it (errors of omission). This is the most useful per-class diagnostic for this dataset.
- **Consumer's accuracy (user's accuracy)** — for each class, the fraction of pixels predicted as that class that are actually that class. Low consumer's accuracy means the classifier is mislabeling other classes as this one (errors of commission).

Kappa is omitted here — it adjusts for chance agreement, but for a straightforward multi-class accuracy assessment with a held-out split, overall accuracy and per-class producer's/consumer's accuracies are more interpretable and actionable.

```js
// ------------------------------------------------------------
// Evaluate on held-out validation data
// ------------------------------------------------------------
var validated = testSet.classify(classifier);

var confusion = validated.errorMatrix('class', 'classification');
print('Confusion matrix', confusion);
print('Overall accuracy', confusion.accuracy());
print("Producer's accuracy (recall per class)", confusion.producersAccuracy());
print("Consumer's accuracy (precision per class)", confusion.consumersAccuracy());
```

For a well-trained classifier on this AOI you should expect overall accuracy above 90%, with water and forest — the spectrally and structurally most distinct classes — achieving the highest per-class accuracies. Man-made surfaces and stressed vegetation are the most likely sources of confusion because their spectral signatures can overlap, particularly in the PC bands. If accuracy for those classes is low, consider adding more training polygons in areas where the RGB image clearly distinguishes them.

