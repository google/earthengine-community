---
title: Anomalies Analysis of Soil Moisture and Precipitation Over a River Basin
description: Soil moisture and precipitation analysis to identify prolonged drought.
author: nasa-gsfc-soilmoisture
tags: smap, gpm, drought, anomalies, iraq
date_published: 2023-03-20
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

We demonstrate the value of NASA's Earth observation in detecting prolonged
droughts over the Mosul River basin in the Middle East where in-situ
measurements are not available or are inaccessible. We use anomalies of soil
moisture (surface and subsurface) as well as precipitation to highlight drought
periods during 2020–2021 where negative anomalies were observed persistently for
months.

This tutorial presents a simple yet effective method for analyzing water budget
dynamics in areas with limited ground data by using Earth observation data in
Google Earth Engine.

Link to Google Earth Engine code: https://code.earthengine.google.com/13c8776e7d2370cbe8a5ff953c89fe75

## 1. Importing Mosul river basin boundary

The Mosul Dam is a large water reservoir located on the Tigris River, which
originates in eastern Turkey and flows through Iraq. The water flow to the dam
reservoir is supplied by the Tigris River, which discharges between
60 and 5000 m³/s of water. Since its construction in 1985, the outflow has
ranged between 100 and 1000 m³/s. The Mosul dam reservoir is a shared river
basin between Iraq and Turkey, with a drainage area of 52,000 km², of which 8%
is in Iraq and 92% outside Iraq.

```js
var basin_boundary = ee.FeatureCollection(
    'projects/ee-nasagsfcsoils/assets/mosul_dissolve');

// Add basin boundary in the map.
Map.addLayer(basin_boundary, {}, 'Area of interest');
Map.centerObject(basin_boundary, 7);
```

## 2. Importing soil moisture and precipitation datasets

The [NASA-USDA Enhanced SMAP dataset](https://developers.google.com/earth-engine/datasets/catalog/NASA_USDA_HSL_SMAP10KM_soil_moisture)
integrates SMAP Level 2 soil moisture
observations into a modified Palmer model using a 1-D Ensemble Kalman Filter,
improving model-based soil moisture estimation, especially in areas with a lack
of quality precipitation instruments. In this demonstration, we used surface and
subsurface soil moisture, which are available from April, 2015 to August, 2022.

Global Precipitation Mission (GPM) is a satellite mission that observes rain and
snow every three hours. The Integrated Multi-satellitE Retrievals for
GPM (IMERG) is the algorithm that provides rainfall estimates using data from
all GPM instruments. In this demonstration, we used
[monthly GPM IMERG Final product](https://developers.google.com/earth-engine/datasets/catalog/NASA_GPM_L3_IMERG_MONTHLY_V06),
which is available from June, 2001 to September, 2021.

```js
// Enhanced soil moisture datasets.
var nasa_usda_smap = ee.ImageCollection('NASA_USDA/HSL/SMAP10KM_soil_moisture');

// Precipitation datasets.
var gpm_imerg = ee.ImageCollection('NASA/GPM_L3/IMERG_MONTHLY_V06');
```

## 3. Define study period and functions

```js
// Define study period.
var startYear = 2001;
var endYear = 2022;
var startMonth = 1;
var endMonth = 12;

var startDate = ee.Date.fromYMD(startYear, startMonth, 1);
var endDate = ee.Date.fromYMD(endYear, endMonth, 31);
var years = ee.List.sequence(startYear, endYear);
var months = ee.List.sequence(1, 12);

// Define a function to convert GPM IMERG from mm/hr to mm/day.
var gpmScale = function(image) {
  return image.multiply(24)
              .copyProperties(image, ['system:time_start']);
};

// Define a function to compute the anomaly for a given month.
var computeAnomalyPrecipitation = function(image) {
  // Get the month of the image.
  var year = image.date().get('year');
  var month = image.date().get('month');
  // Get the corresponding reference image for the month.
  var referenceImage = meanMonthlyPrecipitation.filter(
      ee.Filter.eq('month', month)).first();
  // Check if the images have bands
  var hasBands = image.bandNames().size().gt(0);
  // Compute the anomaly by subtracting reference image from input image.
  var anomalyImage = ee.Algorithms.If(
    hasBands,
    image.subtract(referenceImage),
    image);

  return ee.Image(anomalyImage).set(
    'system:time_start', ee.Date.fromYMD(year, month, 1).millis());
};
```

## 4. Processing soil moisture datasets

We directly use anomalies soil moisture products from NASA-USDA Enhanced SMAP
soil moisture. 

```js
// Anomalies surface and subsurface soil moisture (mm).
var ssSusMa =  nasa_usda_smap
  .filterDate(startDate, endDate)
  .sort('system:time_start', true)  // sort a collection in ascending order
  .select(['ssma', 'susma']);  // surface and subsurface soil moisture bands

// Compute monthly anomalies surface and subsurface soil moisture.
var monthlySsSusMa =  ee.ImageCollection.fromImages(
  years.map(function(y) {
    return months.map(function(m) {
      var filtered = ssSusMa.filter(ee.Filter.calendarRange(y, y, 'year'))
                         .filter(ee.Filter.calendarRange(m, m, 'month'))
                         .mean();
      return filtered.set(
        'system:time_start', ee.Date.fromYMD(y, m, 1).millis());
    });
  }).flatten()
);
```

## 5. Processing precipitation datasets

GPM IMERG does not have anomalies product. To calculate anomalies monthly
precipitation time series from a monthly precipitation time series, subtract the
mean value of each month across all years from the original value of that month
in each year.

```js
// Precipitation from monthly GPM IMERG Final product (mm/day).
var rawMonthlyPrecipitation =
  gpm_imerg
  .select('precipitation')
  .filterDate(startDate, endDate)
  .sort('system:time_start', true)
  .map(gpmScale); // convert rainfall unit from mm/hr to mm/d

// Make sure monthly precipitation has same duration as soil moisture.
var monthlyPrecipitation =  ee.ImageCollection.fromImages(
  years.map(function(y) {
    return months.map(function(m) {
      var filtered = rawMonthlyPrecipitation
                          .filter(ee.Filter.calendarRange(y, y, 'year'))
                          .filter(ee.Filter.calendarRange(m, m, 'month'))
                          .mean();
      return filtered.set({
        'month': m,
        'system:time_start': ee.Date.fromYMD(y, m, 1).millis()
      });
    });
  }).flatten()
);

// Compute climatological monthly precipitation.
var meanMonthlyPrecipitation = ee.ImageCollection.fromImages(
  ee.List.sequence(1, 12).map(function(m) {
    var filtered = monthlyPrecipitation.filter(ee.Filter.eq('month', m)).mean();
    return filtered.set('month', m);
  })
);

// Map the function over the monthly precipitation collection to compute
// the anomaly precipitation for each month.
var monthlyPrecipitationAnomalies = monthlyPrecipitation.map(
    computeAnomalyPrecipitation);
```

## 6. Plot anomalies time series for both soil moisture and precipitation

Use the `ui.Chart.image.series` function to extract the time series of
soil moisture or precipitation pixel values from the soil moisture or
precipitation image and display the chart.

Create a plot that displays three anomaly time series for surface and subsurface
soil moisture and precipitation, with soil moisture values on the primary y-axis
and precipitation values on the secondary y-axis.

This anomalies time series analysis presents the overlap period between these
two datasets, which could span from April, 2015 to September, 2021.

```js
// Combine two image collections into one collection.
var smpreDatasets  = monthlySsSusMa.combine(monthlyPrecipitationAnomalies);
print('soil moisture and precipitation', smpreDatasets);

var chart =
  ui.Chart.image.series({
      imageCollection: smpreDatasets,
      region: basin_boundary,
      scale: 10000,
      xProperty: 'system:time_start'
    })
    .setSeriesNames(['surface SM', 'subsurface SM', 'precipitation'])
    .setOptions({
      title: 'Anomalies time series: surface soil moisture, sub-surface soil ' +
       'moisture, and precipitation',
      series: {
        0: {
            targetAxisIndex: 0, type: 'line', lineWidth: 3,
            pointSize: 1, color: '#ffc61a'
        },
        1: {
            targetAxisIndex: 0, type: 'line', lineWidth: 3, pointSize: 1,
            lineDashStyle: [2, 2], color: '#330000'
        },
        2: {
            targetAxisIndex: 1, type: 'line', lineWidth: 3, pointSize: 1,
            lineDashStyle: [4, 4], color: '#1a1aff'
        },
      },
      hAxis: {
        title: 'Date',
        titleTextStyle: {italic: false, bold: true}
      },
      vAxes: {
        0: {
            title: 'soil moisture (mm)',
            baseline: 0, titleTextStyle: {bold: true, color: '#ffc61a'},
            viewWindow: {min: -4, max: 4}
        },
        1: {
            title: 'precipitation (mm)',
            baseline: 0, titleTextStyle: {bold: true, color: '#1a1aff'},
            viewWindow: {min: -2.5, max: 2.5}
        }
      },
      curveType: 'function'
    });

print(chart);
```

## 7. Plot spatial distribution of soil moisture and precipitation anomalies

Based on the time series anomalies chart, we detected the most negative
anomalies in soil moisture and precipitation in May 2021. The following code
block displays spatial variations in these variables across the studied basin
during that month. Pixels with more brown color have more negative values.

```js
// Setup colors for soil moisture anomalies.
var palette = ['8c510a', 'bf812d', 'dfc27d', 'f6e8c3', 'ffffff',
               'ffffff', 'c7eae5', '80cdc1', '35978f', '01665e'];
var smVis = {
  min: -4,
  max: 4,
  opacity: 0.9,
  palette: palette,
};
// Setup colors for precipitation anomalies.
var preVis = {
  min: -3,
  max: 3,
  opacity: 0.9,
  palette: palette,
};
// Filter soil moisture to May 2021, subset first image, and clip to AOI.
var thisSsSusMa = monthlySsSusMa.filterDate(
  '2021-05-01', '2021-05-31').first().clip(basin_boundary);
// Filter precipitation to May 2021, subset first image, and clip to AOI.
var thisPre = monthlyPrecipitationAnomalies.filterDate(
  '2021-05-01', '2021-05-31').first().clip(basin_boundary);

// Display the images on the map.
Map.addLayer(thisSsSusMa.select('ssma'), smVis, 'Surface Soil Moisture');
Map.addLayer(thisSsSusMa.select('susma'), smVis, 'Subsurface Soil Moisture');
Map.addLayer(thisPre, preVis, 'Precipitation');
```

## 8. Remarks

In 2022, a 3,400-year-old city was discovered in Iraq after the water level
in the Mosul reservoir dropped due to a severe drought. Using Earth
observations, a prolonged drought was detected from mid-2020 to the end of 2021
by tracking the water balance flowing to the Mosul river reservoir. This basin
is challenging to estimate the water budget with in-situ observations due to
insufficient ground observations. Therefore, Earth observations are the only
feasible way to have a completed picture of water availability throughout the
basin.

This tutorial provides a practical approach for other regions which have
similar limited-ground problems as the Mosul River does. There are, however,
limited timeframes for NASA-USDA Enhanced SMAP and monthly GPM IMERG Final
products. In lieu of real-time products, you can use NASA SMAP L3, SMAP L4, and
GPM IMERG Late products instead.

## 9. References

A 3,400-year-old city in Iraq emerges from underwater after an extreme drought.
https://www.cnn.com/2022/06/20/world/iraq-city-unearthed-drought-scn/index.html.
Accessed Date: Mar 20, 2023

Albarakat, R., Le, M. H., & Lakshmi, V.,2022. Assessment of drought conditions
over Iraqi transboundary rivers using FLDAS and satellite datasets.
Journal of Hydrology: Regional Studies, 41, 101075.
doi: 10.1016/j.ejrh.2022.101075

Sazib, N., Mladenova, I. and Bolten, J., 2018. Leveraging the google earth
engine for drought assessment using global soil moisture data. Remote sensing,
10(8): 1265. doi:10.3390/rs10081265

Huffman, G.J., E.F. Stocker, D.T. Bolvin, E.J. Nelkin, Jackson Tan (2019), GPM
IMERG Final Precipitation L3 1 month 0.1 degree x 0.1 degree V06, Greenbelt, MD,
Goddard Earth Sciences Data and Information Services Center (GES DISC)
