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
var regions = ee.FeatureCollection("FAO/GAUL/2015/level2").filter(ee.Filter.inList('ADM1_NAME', ['Maharashtra']));
```
or, they can upload the shapefile by [Importing Table Data](https://developers.google.com/earth-engine/guides/table_upload).

## Selecting the range of years

Define the interval of year, the looping parameter and the start of the year. In order to loop over the year, i.e. to obtain zonal statistics yearly, 
user can define `interval` as `1` and `increment` interval could be over the `year`. Also declare a variable with `interval_count` that 
count the number of years for which you need to extract the data, say the user need the data for 2018, 2019 and 2020 then `interval_count` is `3`.

```
// settings for the years to filter on
var interval = 1;
var interval_unit = 'year';
var interval_count = 3
var start_date = '2018-01-01';
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

### 2. Define the function to calculate zonal statistics

Define a loop function in order to compute mean, variance and standard deviation for each polygons for the range of years.

```
//This function computes statistics for each district
var temporalMean;  // defined dynamically for each temporal image composite.
var startDate;  // defined dynamically for each temporal image composite.
var reduce = function(feature) {
    // Calculate zonal statistics.
    var stats = temporalMean.reduceRegion({
      reducer: reducers,
      geometry: feature.geometry(),
      scale: dataset.first().projection().nominalScale(),
      crs: dataset.first().projection()
    });
    
    // Append date to the statistic label.
    var keys = ee.Dictionary(stats).keys();
    var newKeys = keys.map(function(key) {
      return ee.String(key).cat('_').cat(startDate.format('YYYY'));
    });
    
    // Add the statistic properties to the feature.
    return feature.set(stats.rename(keys, newKeys));
  };
```
### 3. Define the loop to iterate over each year

User can now create a for-loop to map over the `reduce` function defined above.
```
for (var i=0; i < interval_count; i++) {
  var startDate = ee.Date(start_date).advance(i, interval_unit);
  var endDate = startDate.advance(interval, interval_unit);
  var temporalMean = dataset.filterDate(startDate, endDate).mean();
  regions = regions.map(reduce);
}
//print(regions)
```

## Exporting Table
The user can export the final result as table using [Export.table.toDrive](https://developers.google.com/earth-engine/guides/exporting?hl=en#to-drive_1)
or [Export.table.toAsset](https://developers.google.com/earth-engine/guides/exporting?hl=en#to-asset_1).
```
Export.table.toDrive({
  collection: regions,
  description:'zonal_EVI',
});
```
