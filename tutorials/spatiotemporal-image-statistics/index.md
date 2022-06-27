---
title: Spatiotemporal Statistics of Vegetation Indices
description: Calculate zonal statistics over time and export as long and wide tables in comma delimited format.
author: saumyatas
tags: featurecollection, zonal, statistics, ndvi, evi, reducer
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

This tutorial demonstrates how to create a comma delimited table of zonal
statistics of vegetation indices (NDVI or EVI) over a study area, for a given
range of years.

## Import datasets

### Vegetation index

Google Earth Engine has a range data products that provide time series of
vegetation indices. Here, we use the MODIS
[Terra Vegetation Indices for 16-days Global 250m](https://developers.google.com/earth-engine/datasets/catalog/MODIS_006_MOD13Q1)
product (also available at 500m and 1km resolution). After importing, we select
the 'EVI' band.

```js
var dataset = ee.ImageCollection('MODIS/006/MOD13Q1')
                  .select('EVI');  // or 'NDVI'
```

### Region of interest

A FeatureCollection (or Geometry) is needed to define regions to summarize
vegetation index data over. For example, you can use the
[Global Administrative Unit Layers (GAUL) dataset](https://developers.google.com/earth-engine/datasets/catalog/FAO_GAUL_2015_level2?hl=en),
to extract zonal statistics for administrative regions. The GAUL provides
administrative unit boundaries for all countries in the world at three levels.
Here, we'll use the districts of Maharashtra, India; we'll get zonal
statistics for each district (35 districts).

```js
var regions = ee.FeatureCollection('FAO/GAUL/2015/level2')
                  .filter(ee.Filter.inList('ADM1_NAME', ['Maharashtra']));
```

Alternatively, you can select a different FeatureCollection from the
[Earth Engine Data Catalog](https://developers.google.com/earth-engine/datasets)
or upload your own ShapeFile by following the instructions in the
[Importing Table Data](https://developers.google.com/earth-engine/guides/table_upload)
section of the Earth Engine Developer's Guide.

## Defining spatiotemporal reduction parameters

The statistics we're after include spatial and temporal components. Above,
we've defined the bounds of the spatial component, now we define the temporal
component, i.e. the series of time windows to generate representative composite
vegetation index images for. The following variables set the length a time
window and the duration of the series.

The variables are set to generate zonal statistics (`spatialReducers`) for
image composites constructed from three time periods (`intervalCount`) that
start on 2018-01-01 (`startDate`) with each time window being 1 (`interval`)
year (`intervalUnit`) reduced by mean (`temporalReducer`). In other words, we'll
be generating annual mean vegetation index zonal statistics for years 2018,
2019, and 2020.

```js
var startDate = '2018-01-01';  // time period of interest beginning date
var interval = 1;  // time window length
var intervalUnit = 'year';  // unit of time e.g. 'year', 'month', 'day'
var intervalCount = 3;  // number of time windows in the series
var temporalReducer = ee.Reducer.mean();  // how to reduce images in time window

// Defines mean, standard deviation, and variance as the zonal statistics.
var spatialReducers = ee.Reducer.mean().combine({
        reducer2: ee.Reducer.stdDev(),
        sharedInputs: true
      }).combine({
        reducer2: ee.Reducer.variance(),
        sharedInputs: true
      });
```

## Calculating spatiotemporal statistics

Now, we'll calculate spatiotemporal vegetation index statistics. Two ways to
arrange the statistics table are provided: a long table and a wide table.
Depending on your application, one arrangement might be more suitable than the
other. The resulting tables are
[exported to Google Drive](https://developers.google.com/earth-engine/guides/exporting#to-drive)
as a CSV file, but there are multiple
[other ways to export](https://developers.google.com/earth-engine/guides/exporting#exporting-tables-and-vector-data),
including downloading the CSV file directly using
[`getDownloadURL`](https://developers.google.com/earth-engine/apidocs/ee-featurecollection-getdownloadurl).

### Long table

The long table format will have one row per unique combination of region and
time window. So in this example, there will be 105 rows
(35 districts * 3 time windows). First, a list of 0-based time window
indices is constructed, then we map over the time window index list to generate
composite images for each time window, and then apply `reduceRegions` to
calculate the zonal statistics per region. Finally, the start date of the
time window is added as a feature property so the statistics can be tied to
a given image composite. The result is a FeatureCollection of
FeatureCollections, which must be flattened. The flattened FeatureCollection is
then exported to Google Drive as a CSV file.

```js
// Get time window index sequence.
var intervals = ee.List.sequence(0, intervalCount-1, interval);

// Map reductions over index sequence to calculate statistics for each interval.
var zonalStatsL = intervals.map(function(i) {
  // Calculate temporal composite.
  var startRangeL = ee.Date(startDate).advance(i, intervalUnit);
  var endRangeL = startRangeL.advance(interval, intervalUnit);
  var temporalStat = dataset.filterDate(startRangeL, endRangeL)
                              .reduce(temporalReducer);

  // Calculate zonal statistics.
  var statsL = temporalStat.reduceRegions({
    collection: regions,
    reducer: spatialReducers,
    scale: dataset.first().projection().nominalScale(),
    crs: dataset.first().projection()
  });

  // Set start date as a feature property.
  return statsL.map(function(feature) {
    return feature.set({
      composite_start: startRangeL.format('YYYY'),  // or 'YYYY-MM-dd'
    });
  });
});

zonalStatsL = ee.FeatureCollection(zonalStatsL).flatten();

print('Spatiotemporal statistics (long)', zonalStatsL);

Export.table.toDrive({
  collection: zonalStatsL,
  description: 'zonal_stats_long',
});
```

### Wide table

The wide table will have one row for each region (35 rows in this case) with
a column per unique combination of statistic and time window. The new column
names are the concatenation of the statistic and the time window separated
by an underscore. The process uses a client-side for loop on the number
of time windows, and for each one, zonal statistics are calculated and appended
as new properties to the FeatureCollection. An alternative approach is to use
Earth Engine's `iterate` function, but a comparison of the approaches'
performance was equal, so we've chosen the for loop for improved readability.

```js
var temporalStatW;  // defined dynamically for each temporal image composite
var startRangeW;  // defined dynamically for each temporal image composite
var reduce = function(feature) {
  // Calculate zonal statistics.
  var statsW = temporalStatW.reduceRegion({
    reducer: spatialReducers,
    geometry: feature.geometry(),
    scale: dataset.first().projection().nominalScale(),
    crs: dataset.first().projection()
  });

  // Append date to the statistic label.
  var keys = ee.Dictionary(statsW).keys();
  var newKeys = keys.map(function(key) {
    return ee.String(key).cat('_')
               .cat(startRangeW.format('YYYY'));  // or 'YYYY-MM-dd'
  });

  // Add the statistic properties to the feature.
  return feature.set(statsW.rename(keys, newKeys));
};

var zonalStatsW = regions;  // make a copy of the regions FeatureCollection

// Loop through sequence of intervals to calculate statistics for each.
for (var i = 0; i < intervalCount; i++) {
  var startRangeW = ee.Date(startDate).advance(i, intervalUnit);
  var endRangeW = startRangeW.advance(interval, intervalUnit);
  temporalStatW = dataset.filterDate(startRangeW, endRangeW).mean()
                              .reduce(temporalReducer);
  zonalStatsW = zonalStatsW.map(reduce);
}

print('Spatiotemporal statistics (wide)', zonalStatsW);

Export.table.toDrive({
  collection: zonalStatsW,
  description:'zonal_stats_wide',
});
```
