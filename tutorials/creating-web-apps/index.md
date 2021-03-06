####Draft

---
title: Creating Web Applications
description: This tutorial provides a beginner-level introduction to developing web applications using Earth Engine.
author: TC25
tags: introductory, app development, data visualization
date_published: 2021-03-06
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

In this tutorial, we will provide a step-by-step guide to creating a simple Earth Engine web app to visualize riving distance to COVID-19 sites in the US with a few basic functionality like extracting data, changing layers, and extracting images at the county-level. The tutorial will not go into how to start developing apps since that i covered in sufficient detail at [https://developers.google.com/earth-engine/guides/apps](https://developers.google.com/earth-engine/guides/apps).
## Introduction

Earth Engine has a feature to share your analysis and data as web applications with no backend development required of the users. This functionality can be useful for both disseminating scientific results and for teaching geospaial analysis and visualization. 

#### A step-by-step guide: Displaying 

Let's analyze images over a region of interest (the counties of Connecticut):

**1.** As before, we start by loading in the feature and image collections of
interest.

```javascript
// Set map center over the state of CT.
Map.setCenter(-72.6978, 41.6798, 8);
// Load the MODIS MYD11A2 (8-day LST) image collection.
var raw = ee.ImageCollection('MODIS/006/MYD11A2');
// Load US county dataset.
var countyData = ee.FeatureCollection('TIGER/2018/Counties');
// Filter the counties that are in Connecticut.
// This will be the region of interest for the image operations.
var roi = countyData.filter(ee.Filter.eq('STATEFP', '09'));
// Examine image collection.
print(raw);
```

**2.** We select the bands and images in the collection we are interested in.

```javascript
// Select a band of the image collection using either indexing or band name.
var bandSel1 = raw.select(0);
var bandSel2 = raw.select('LST_Day_1km');
// Filter the image collection by a date range.
var filtered = raw.filterDate('2002-12-30', '2004-4-27');
// Print filtered collection.
print(filtered);
// Limit the image collection to the first 50 elements.
var limited = raw.limit(50);
// Print collections.
print(limited);
print(bandSel1);
```

**3.** We calculate the mean of all the images in the collection, clip it to the
geometry of interest and scale it to convert it from digital number to degree
Celsius.

```javascript
// Calculate mean of all images (pixel-by-pixel) in the collection.
var mean = bandSel1.mean();
// Isolate image to region of interest.
var clipped = mean.clip(roi);
// mathematical operation on image pixels to convert from digital number
// of satellite observations to degree Celsius.
var calculate = clipped.multiply(0.02).subtract(273.15);
// Add the layer to the map with a specified color palette and layer name.
Map.addLayer(
    calculate, {min: 15, max: 20, palette: ['blue', 'green', 'red']}, 'LST');
```

**4.** We mask out parts of the image to display regions above and below certain
temperature thresholds.

```javascript
// Select pixels in the image that are greater than 30.8.
var mask = calculate.gt(18);
// Add the mask to the map with a layer name.
Map.addLayer(mask, {}, 'mask');
// Use selected pixels to update the mask of the whole image.
var masked = calculate.updateMask(mask);
// Add the final layer to the map with a specified color palette and layer name.
Map.addLayer(masked,
  {min: 18, max: 25, palette: ['blue', 'green', 'red']}, 'LST_masked');
```

![Masked LST image](masked-image.png)



## Example applications

 What can you do with Google Earth Engine?

- [EE Population Explorer](https://google.earthengine.app/view/population-explorer)
- [EE Ocean Time Series Investigator](https://google.earthengine.app/view/ocean)
- [Global Surface UHI Explorer](https://yceo.users.earthengine.app/view/uhimap)
- [Stratifi - cloud-based stratification](https://sabrinaszeto.users.earthengine.app/view/stratifi)
- [And hundreds more...](https://philippgaertner.github.io/2019/04/earth-engine-apps-inventory/)

## Additional resources

- [Google Earth Engine API documentation](https://developers.google.com/earth-engine/)
- [Google Earth Engine Developers forum](https://groups.google.com/forum/#!forum/google-earth-engine-developers)
- [Example scripts from Prof. Dana Tomlin's handouts for his course on Geospatial Software Design](https://github.com/EEYale/example-scripts)

