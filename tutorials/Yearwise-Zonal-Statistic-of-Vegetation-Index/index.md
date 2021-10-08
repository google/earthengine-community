---
title: Spatiotemporal Statistics of Vegetation Index
description: This tutorial demonstrate how users can create a Comma delimited table with zonal statistics of Vegetation index for their study area (Feature or FeatureCollections) for the range of years.
author: saumyatas
tags: featurecollection, zonal, statistics, NDVI, EVI, ee.Reducer
date_published: 2021-09-21
---
<!--
Copyright 2021 The Google Earth Engine Community Authors

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

This tutorial demonstrates how users can create a Comma delimited table with zonal statistics of the Vegetation index (NDVI or EVI)
for their study area (`ee.FeatureCollection`) for the range of years.

## Import datasets

1. Vegetation Index Layer

Google Earth Engine provides range of MODIS data products including [Terra Vegetation Indices for 16-days Global (250m, 500m or 1km)](https://developers.google.com/earth-engine/datasets/catalog/MODIS_006_MOD13Q1). In order to extract vegetation index, user can select NDVI and EVI index from these MODIS Products.
```
var dataset = ee.ImageCollection('MODIS/006/MOD13Q1')
              .select('EVI'); // or 'NDVI'
```

2. Polygons 

Users can use the [Global Administrative Unit Layers (GAUL) administrative layer](https://developers.google.com/earth-engine/datasets/catalog/FAO_GAUL_2015_level2?hl=en), in order to extract their respective region. The GAUL provides the information on administrative units for all the countries in the world at three levels.
```
var poly = ee.FeatureCollection("FAO/GAUL/2015/level2").filter(ee.Filter.inList('ADM1_NAME', ['Maharashtra']));
```
or, they can upload the shapefile by [Importing Table Data](https://developers.google.com/earth-engine/guides/table_upload).

## Selecting the range of years

Define the interval of year, the looping parameter and the start of the year. In order to loop over the year, i.e. to obtain zonal statistics yearly, 
user can define `interval` as '1' and `increment` interval could be over the 'year'. 

```
// settings for the years to filter on
var interval = 1;
var increment = 'year';
var start_date = '2015-01-01';
var end_date = '2017-01-01';
```
Create the `list` of year in order to map over the function later. [ee.Date](https://developers.google.com/earth-engine/apidocs/ee-date?hl=en)
function can be used to construct the Date object for the start and end date.
```
var nIntervals = ee.Date(end_date).difference(start_date, increment).subtract(1);
var startDates = ee.List.sequence(0, nIntervals, interval);
var ranges = startDates.map(function(i) {
  var startRange = ee.Date(start_date).advance(i, increment);
  var endRange = startRange.advance(interval, increment);
  return ee.DateRange(startRange, endRange);
});
//print(ranges)
var myList = ee.List.sequence(0, ranges.length().subtract(1), 1)
var list = myList.map(function (number){
  var range1 = ee.DateRange(ranges.get(number)).start().millis()  
  return range1
})
// print(list)
```

## Evaluating Zonal Statistics

### 1. Define Reducer function 

In this section, user can define a `ee.Reducer` in order to calculate mean, median and variance of the vegetation index for each year. 
Reducer function is used to aggregate data for each polygons and for each bands. As here we are applying multiple reducers with single input, thus
user can call `combine()` on a reducer with `sharedInputs` set to `true`. 

```
var reducers = ee.Reducer.mean().combine({
  reducer2: ee.Reducer.stdDev(),
  sharedInputs: true
  }).combine({
  reducer2: ee.Reducer.variance(),
  sharedInputs: true
  });
```

### 2. Define the looping function

Define a nested loop function in order to compute mean, variance and standard deviation for each polygons for the range of years.

```
var feat
//This function computes statistics for each district
var EVIstat = function(feature) {
  var composites_value = function(date, feat){
    date = ee.Date(date)
    feat = ee.Feature(feat)
    var actualyear = date.get('year')
    var filtCol = dataset.filterDate(ee.Date(date), ee.Date(date).advance(interval, increment));
    var meanImage = filtCol.mean().clip(feature.geometry());
    // add the mean to every image
    var combineVal = meanImage.reduceRegion({
      reducer: reducers,
      geometry: feature.geometry(),
      scale: 250
    });
    var mean = ee.Number(combineVal.get("EVI_mean"));
    var mean_name = ee.String("EVI_mean_").cat(actualyear)
    
    var stdDev = ee.Number(combineVal.get("EVI_stdDev"));
    var stdDev_name = ee.String("EVI_stdDev_").cat(actualyear)
    
    var variance = ee.Number(combineVal.get("EVI_variance"));
    var variance_name = ee.String("EVI_variance_").cat(actualyear)
    
    return feat.set(mean_name, mean, stdDev_name, stdDev, variance_name, variance)
  };
```
Iterate over the inner loop, by passing polygons as a feature data for the `composite_value` function.

```
// iterate over the sequence
  var newfeat = ee.Feature(list.iterate(composites_value, feature))
```
Now, return the table with new properties or columns as a final result.

```
// return feature with new properties
  return newfeat 
```
At last, user can define a new parameter to map over `EVIstat` function by passing the `polygon` as a feature dataset.

```
var result = poly.map(EVIstat);
```

## Exporting Table
The user can export the final result as table using [Export.table.toDrive](https://developers.google.com/earth-engine/guides/exporting?hl=en#to-drive_1)
or [Export.table.toAsset](https://developers.google.com/earth-engine/guides/exporting?hl=en#to-asset_1).
```
Export.table.toDrive({
  collection: result,
  description:'zonal_EVI',
});
```
