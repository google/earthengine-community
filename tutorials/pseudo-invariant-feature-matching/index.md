---
title: Pseudo-Invariant Feature Matching
description: Applying relative radiometric normalization to a pair of Planet SkySat images with PIF matching.
author: aazuspan
tags: pseudo-invariant-feature-matching, radiometric-normalization, change-detection, planet-skysat, deforestation
date_published: 2023-05-07
---
<!--
Copyright 2020 The Google Earth Engine Community Authors

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an 'AS IS' BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

This tutorial demonstrates how pseudo-invariant feature (PIF) matching can be used to harmonize radiometric characteristics between images by applying the technique to a pair of [Planet SkySat](https://developers.google.com/earth-engine/datasets/catalog/SKYSAT_GEN-A_PUBLIC_ORTHO_MULTISPECTRAL) images acquired before and after a deforestation event in Peru.

[Open in the Code Editor](https://code.earthengine.google.com/2519effefdc6e25ad98eb07b23a21999)

## Background

Relative radiometric normalization techniques like [histogram matching](https://developers.google.com/earth-engine/tutorials/community/histogram-matching), [multivariate alteration detection (MAD)](https://developers.google.com/earth-engine/tutorials/community/imad-tutorial-pt1), and PIF matching apply transformations between images that were acquired at different times, under different conditions, or by different sensors, reducing radiometric differences to allow for more accurate comparisons and change detection ([Schroeder et al., 2006](#references)). PIF matching works by identifying areas with minimal spectral change between images, known as pseudo-invariant features, and applying a linear transformation to the entire image based on the spectral differences between these areas.

## Input Data

The code below loads two Planet SkySat images acquired before and after a logging operation in Peru, clips them to a small area of interest, selects the relevant multispectral bands, and uses the [`register`](https://developers.google.com/earth-engine/apidocs/ee-image-register) method to correct a slight misregistration between images.

```javascript
var aoi = ee.Geometry.Point([-75.0608, -8.2736]).buffer(3000).bounds();
var bands = ee.List(['N', 'R', 'G', 'B']);

var before = ee.Image('SKYSAT/GEN-A/PUBLIC/ORTHO/MULTISPECTRAL/s02_20150804T151429Z')
  .select(bands)
  .clip(aoi);
var after = ee.Image('SKYSAT/GEN-A/PUBLIC/ORTHO/MULTISPECTRAL/s01_20150910T154218Z')
  .select(bands)
  .clip(aoi)
  .register(before, 100);
```

Adding the images to the map shows the radiometric mismatch between them: the 'after' image appears much brighter than the 'before' image, making direct comparisons more difficult.

```javascript
Map.addLayer(before, {min: 1000, max: 5000}, 'Before');
Map.addLayer(after, {min: 1000, max: 5000}, 'After');
```

| *Before* | *After* |
|:------:|:-----:|
| ![Before image](pif_target.png) | ![After image](pif_source.png) |

## Identifying Pseudo-Invariant Features

With the before and after images loaded and aligned, the next step is to identify spectrally stable, pseudo-invariant features that can be used to match the images.
While PIFs *can* be selected manually by identifying unchanged areas and digitizing points or polygons around them, this approach can be time-consuming and subjective. Spectral distance metrics provide an automated method for measuring similarity between pixels, which can then be used to select a subset of pixels with the smallest spectral changes. 

### Measuring Spectral Distance

The code below uses the [`spectralDistance`](https://developers.google.com/earth-engine/apidocs/ee-image-spectraldistance) method to calculate spectral information divergence (SID) between the before and after images. You can also experiment with other distance metrics like spectral angle mapper (SAM) or squared euclidean distance (SED) to see how they affect results.

```javascript
var distance = before.spectralDistance(after, 'SID');
Map.addLayer(distance, {min: 0, max: 0.4}, 'Spectral distance');
```

Visualizing spectral distance highlights areas of change that correspond with logging, road construction, and cloud shadows:

![Spectral distance](pif_distance.png)

### Selecting Stable Pixels

The next step is to select a subset of pixels that experienced little or no change. This can be done by applying a percentile reducer over the area of interest to identify a spectral distance threshold, then selecting pixels with distances below that threshold. The code below uses a 10th percentile threshold, but you may want to modify the percentile to see how it affects results. Higher percentiles will select more pixels and include more variability, leading to more aggressive transformations.

```javascript
var threshold = distance.reduceRegion({
  reducer: ee.Reducer.percentile([10]),
  geometry: aoi,
  scale: 1,
  bestEffort: true,
  maxPixels: 1e6,
}).getNumber('distance');

var pif = distance.lt(threshold);
Map.addLayer(pif, {}, 'PIF mask');
```

![PIF mask](pif_mask.png)


## Applying the Transformation

With pseudo-invariant pixels identified, the next step is to build linear transformations between these areas in the before and after image, which can then be applied to the entire image. This can be done by mapping over each band and: 

1. Masking the before and after image to the PIF.
2. Using a [`linearFit`](https://developers.google.com/earth-engine/apidocs/ee-reducer-linearfit) reducer to calculate regression coefficients between the masked images in the area of interest.
3. Applying the linear coefficients to match the after image to the before image.

The function below applies all three steps to a single band for convenience:

```javascript
function matchBand(band) {
  var beforePif = before.select([band]).updateMask(pif);
  var afterPif = after.select([band]).updateMask(pif);

  var args = {
    reducer: ee.Reducer.linearFit(),
    geometry: aoi,
    scale: 1,
    maxPixels: 1e6,
    bestEffort: true
  };

  var coeffs = ee.Image.cat([afterPif, beforePif])
    .reduceRegion(args);

  return after
    .select([band])
    .multiply(coeffs.getNumber('scale'))
    .add(coeffs.getNumber('offset'));
}
```

Mapping that function over the list of `bands` defined at the beginning of the tutorial will return a list of matched single-band images, which can then be combined back into a multi-band image.

```javascript
var matchedBands = bands.map(matchBand);
var matched = ee.ImageCollection(matchedBands).toBands().rename(bands);
```

Here are the results, showing the before, after (matched), and after (original) images:

```javascript
Map.addLayer(before, {min: 1000, max: 5000}, 'Before');
Map.addLayer(matched, {min: 1000, max: 5000}, 'After (Matched)');
Map.addLayer(after, {min: 1000, max: 5000}, 'After (Original)');
```

| *Before* | *After (Matched)* | *After (Original)* |
|:------:|:---------------:|:----------------:|
| ![Before image](pif_target.png) | ![After - matched](pif_matched.png) | ![After - original](pif_source.png) |


## Conclusion

The full code is below, or you can [open it in the Code Editor](https://code.earthengine.google.com/2519effefdc6e25ad98eb07b23a21999).

```javascript
// Select an area of interest and define multispectral bands to use
var aoi = ee.Geometry.Point([-75.0608, -8.2736]).buffer(3000).bounds();
var bands = ee.List(['N', 'R', 'G', 'B']);

// Select a pair of Planet SkySat images acquired before and after deforestation
var before = ee.Image('SKYSAT/GEN-A/PUBLIC/ORTHO/MULTISPECTRAL/s02_20150804T151429Z')
  .select(bands)
  .clip(aoi);
var after = ee.Image('SKYSAT/GEN-A/PUBLIC/ORTHO/MULTISPECTRAL/s01_20150910T154218Z')
  .select(bands)
  .clip(aoi)
  .register(before, 100);

// Calculate spectral distance as a measure of change between the images
var distance = before.spectralDistance(after, 'sid');

// Identify the 10th percentile of change
var threshold = distance.reduceRegion({
  reducer: ee.Reducer.percentile([10]),
  geometry: aoi,
  scale: 1,
  bestEffort: true,
  maxPixels: 1e6,
}).getNumber('distance');

// Define pseudo-invariant features below the change threshold
var pif = distance.lt(threshold);

function matchBand(band) {
  // Select just the PIF areas in each image
  var beforePif = before.select([band]).updateMask(pif);
  var afterPif = after.select([band]).updateMask(pif);

  // Define a linear reducer to calculate a transformation between images
  var args = {
    reducer: ee.Reducer.linearFit(),
    geometry: aoi,
    scale: 1,
    maxPixels: 1e6,
    bestEffort: true
    };

  // Calculate the linear coefficients
  var coeffs = ee.Image.cat([afterPif, beforePif])
    .reduceRegion(args);

  // Apply the coefficients to match the after band to the before band
  return after
    .select([band])
    .multiply(coeffs.getNumber('scale'))
    .add(coeffs.getNumber('offset'));
}

// Match each band, then combine them back into a single multi-band image
var matchedBands = bands.map(matchBand);
var matched = ee.ImageCollection(matchedBands).toBands().rename(bands);

Map.centerObject(aoi);
Map.addLayer(distance, {min: 0, max: 0.4}, 'Spectral distance');
Map.addLayer(pif, {}, 'PIF mask');
Map.addLayer(before, {min: 1000, max: 5000}, 'Before');
Map.addLayer(matched, {min: 1000, max: 5000}, 'After (Matched)');
Map.addLayer(after, {min: 1000, max: 5000}, 'After (Original)');
```

## References

[Schroeder, Todd A.; Cohen, Warren B.; Song, Conghe; Canty, Morton J.; Yang, Zhiqiang. 2006. Radiometric correction of multi-temporal Landsat data for characterization of early successional forest patterns in western Oregon. Remote Sensing of Environment. 103: 16-26](https://www.fs.usda.gov/research/treesearch/27231)