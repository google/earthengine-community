---
title: Forest Cover and Loss Estimation
description: Estimate tree area and loss by country based on minimum canopy cover and forest area definition.
author: nkeikon
tags: forest, deforestation, mmu, ghg, redd, mrv, frel, frl
date_published: 2019-10-04
---
<!--
Copyright 2019 The Google Earth Engine Community Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

[Open In Code Editor](https://code.earthengine.google.com/09a2542381c5d7d79a772ba049b4b63d)

When estimating forest cover, deforestation, or emissions from land-use change at the national level, countries use forest definitions. In this tutorial, you will learn how to extract forest area by applying technical thresholds of canopy cover and minimum area requirements. 

## Context

The Food and Agriculture Organization of the United Nations (FAO) defines forests as "Land spanning more than 0.5 hectares with trees higher than 5 meters and a canopy cover of more than 10 percent, or trees able to reach these thresholds in situ. It does not include land that is predominantly under agricultural or urban land use" (FAO 2015). 

In various reporting of forest and/or land-use related data, countries may have different forest definitions, including these parameters, forest types or land use categories. 

## Instructions
### Select a country and set parameters

This tutorial selected Bolivia as an example, with the minimum canopy cover of 10% and minimum forest area of 0.5 ha (the national definition may be different). 
```js
// Selected country (e.g. Bolivia)
var country = 'Bolivia';
// Canopy cover percentage (e.g. 10%)
var cc = ee.Number(10);
// Minimum forest area in pixels (e.g. 6 pixels, approximately 0.5 ha in this example)
var pixels = ee.Number(6);
// Minimum mapping area for tree loss (usually same as the minimum forest area)
var lossPixels = ee.Number(6);

// Load country features from Large Scale International Boundary (LSIB) dataset.
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var selected = countries.filter(ee.Filter.eq('country_na', ee.String(country)));
```

Depending on the location of the country, the number of pixels that make up for 0.5 ha would differ. You can adjust this by calculating the actual minimum areas you were using (see step 6 below).

### Tree cover

Currently, Google Earth Engine has several tree cover datasets in the catalogue, including the Global Forest Change (GFC) (year 2000) and GLCF: Landsat Tree Cover Continuous Fields (2000, 2005, and 2010). Here, we use the Global Forest Change dataset. 
```js
var gfc2018 = ee.Image('UMD/hansen/global_forest_change_2018_v1_6');
```

1. Select 'treecover2000' in the Global Forest Change dataset
```js
var canopyCover = gfc2018.select(['treecover2000']);
```
2. Apply the minimum canopy cover percentage (e.g. greater than or equal to 10%). Use selfMask() to set other other areas transparent by assigning value zero
```js
var canopyCover10 = canopyCover.gte(cc).selfMask();
```
3. Apply the minimum area requirement using `connectedPixelCount` (e.g. greater than or equal to 6 pixels). Note that if no kernel is passed to `connectedPixelCount`, 8 neighbor adjacency is used to determine connectivity
```js
// Use connectedPixelCount() to get contiguous area.
var contArea = canopyCover10.connectedPixelCount();
// Apply the minimum area requirement.
var minArea = contArea.gte(pixels).selfMask();
```
4. Scale the results in nominal value based on to the dataset's projection to display on the map. Reprojecting with a specified scale ensures that pixel area does not change with zoom.
```js
var prj = gfc2018.projection();
var scale = prj.nominalScale();
Map.addLayer(minArea.reproject(prj.atScale(scale)), {
    palette: ['#96ED89']
}, 'tree cover: >= min canopy cover & area (light green)');
```
5. Calculate the tree cover area (ha). Use pixelArea() to get the value of each pixel in square metres, divide by 10,000 to convert to hectare, and sum over the result for a measure of area
```js
var forestArea = minArea.multiply(ee.Image.pixelArea()).divide(10000);
var forestSize = forestArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
print(
    'Year 2000 tree cover (ha) \nmeeting minimum canopy cover and \nforest area thresholds \n ',
    forestSize.get('treecover2000'));
```
6. Calculate the actual average minimum forest area used (ha). This is to make sure if the selected number of pixels for minimum area (e.g. 6) matches or comes close to the minimum area intended in hectare (e.g. 0.5 ha)
```js
var pixelCount = minArea.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
var onePixel = forestSize.getNumber('treecover2000').divide(pixelCount.getNumber('treecover2000'));
var minAreaUsed = onePixel.multiply(pixels);
print('Minimum forest area used (ha)\n ', minAreaUsed);
```
The GFC dataset uses 30x30m pixels. Therefore, 6 pixels (>5,000/(30x30)) is used for this exercise. This can be used for countries near the equator. For countries in higher or lower latitudes, you would need to increase the number of pixels. 

![](alltrees.png)          |  ![](cc10.png)            |  ![](treecover00.png)
:-------------------------:|:-------------------------:|:-------------------------:
All trees (yellow)             |  >= min canopy cover (orange)        |  >= min canopy cover & tree area (light green)

### Tree loss

We use the Global Forest Change dataset (year 2001) to demonstrate how to estimate tree loss based on forest definition.

1. Select tree loss pixels that are inside the derived tree cover
```js
var treeLoss = gfc2018.select(['lossyear']);
var treeLoss01 = treeLoss.eq(1).selfMask(); // tree loss in year 2001
// Select the tree loss within the derived tree cover (>= canopy cover and area requirements).
var treecoverLoss01 = minArea.and(treeLoss01).rename('loss2001').selfMask();
```
2. Apply the minimum mapping unit using `connectedPixelCount`
```js
// Create connectedPixelCount() to get contiguous area.
var contLoss = treecoverLoss01.connectedPixelCount();
// Apply the minimum area requirement.
var minLoss = contLoss.gte(lossPixels).selfMask();
```
3. Calculate the tree loss area (ha)
```js
var lossArea = minLoss.multiply(ee.Image.pixelArea()).divide(10000);
var lossSize = lossArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
print(
    'Year 2001 tree loss (ha) \nmeeting minimum canopy cover and \nforest area thresholds \n ',
    lossSize.get('loss2001'));
```
![](allloss.png)           |  ![](losstreecover.png)   |  ![](lossmin.png)
:-------------------------:|:-------------------------:|:-------------------------:
All tree loss (black), tree cover (green)             |  Loss inside tree cover (purple)        |  Loss inside tree cover & >= min tree area (red)


### Subsequent tree cover

You can estimate the tree cover after the loss by subtracting the loss from the previous tree cover. You can also add tree gain if you have data.

1. Use the derived tree cover and tree loss from the previous steps
2. Create a new tree cover by removing the tree loss
```js
// Unmask the derived loss.
var minLossUnmask = minLoss.unmask();
// Switch the binary value of the loss (0, 1) to (1, 0).
var notLoss = minLossUnmask.select('loss2001').eq(0);
// Combine the derived tree cover and not-loss with 'and'.
var treecoverLoss01 = minArea.and(notLoss).selfMask();
```
3. Apply the minimum area requirement to the above tree cover (minimum canopy cover threshold is already applied by using the derived tree cover). Reproject in nominal scale when displaying on the map. 
```js
var contArea01 = treecoverLoss01.connectedPixelCount();
var minArea01 = contArea01.gte(pixels);
Map.addLayer(minArea01.reproject(prj.atScale(scale)), {
    palette: ['#168039']
}, 'tree cover 2001 (gain not considered) (light green)');
```
4. Calculate the new tree cover area (ha)
```js
var forestArea01 = minArea01.multiply(ee.Image.pixelArea()).divide(10000);
var forestSize01 = forestArea01.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
print(
    'Year 2001 tree cover (ha) \nmeeting minimum canopy cover and \nforest area thresholds \n ',
    forestSize01.get('treecover2000'));
```
![](treecover2000.png)     |  ![](treeloss2001.png)    |  ![](treecover2001.png)
:-------------------------:|:-------------------------:|:-------------------------:
Tree cover 2000 (light green)             |  Tree loss 2001 (red)        |  Tree cover 2001 (dark green)

## Land use categories

You can also exclude certain tree areas such as tree plantations or agricultural plantations with tree crops if you have spatial data for these areas (e.g. masking, assigning values, etc. - not included in this tutorial). 

## References
- GOFC-GOLD 2013 A sourcebook of methods and procedures for monitoring and reporting anthropogenic greenhouse gas emissions and removals associated with deforestation, gains and losses of carbon stocks in forests remaining forests, and forestation p 126 GOFC-GOLD Report (version COP22-1)
- FAO 2018 From reference levels to results reporting: REDD+ under the UNFCCC 2018 update (Food and Agriculture Organization of the United Nations) (http://fao.org/3/CA0176EN/ca0176en.pdf)
- Forest Resources Assessment Programme (FAO) 2015 Global forest resources assessment 2015 (http://fao.org/3/a-i4808e.pdf)
- Nomura, K., Mitchard, E.T., Bowers, S.J. and Patenaude, G., 2019. Missed carbon emissions from forests: comparing countries' estimates submitted to UNFCCC to biophysical estimates. Environmental Research Letters (https://iopscience.iop.org/article/10.1088/1748-9326/aafc6b)
