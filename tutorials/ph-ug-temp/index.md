---
title: Studying Land Surface Temperature for Public Health Research in Uganda
description: This tutorial shows how to describe, visualize, and export Earth Engine exposure data for public health research.
author: hiyer09
tags: temperature, descriptive analysis, Africa, remote sensing
date_published: 2019-10-06
---

[Open In Code Editor](https://code.earthengine.google.com/f65e9a496bbafa257147730d06081c61)

Learning objectives:
* Introduce remote sensing data.
* Learn how to obtain and process raster climate data in Google Earth Engine.

Remote sensing (satellite-derived) data are a rich source of information about climate variables, including land cover, vegetation, rainfall, and temperature. Satellite data are available going back to the 1980s in many cases, and so they provide a means for doing historical analyses of changing geographies that can be linked with epidemiologic data for analysis.
In this exercise, you will learn how to acquire remote sensing data from Google Earth Engine. You will learn how to perform time series analysis to study changes in climate variables over our chosen geography and time period. You will also apply some common geospatial procedures (zonal, focal statistics). Finally, you will learn how to export our Earth Engine raster files to Google Drive.

![](ee-chart-v2.png)  |  ![](ph_ug_lst.png) |
:-------------------------:|:-------------------------:|
Time series chart (Land Surface Temperature in Uganda)             |  Heat Map of Land Surface Temperature in Uganda        |



## Writing a simple JavaScript program to extract and process data

You will analyze Land Surface Temperature (LST) data collected using the Moderate Resolution Imaging Spectroradiometer ([MODIS](https://lpdaac.usgs.gov/products/mod11a2v006/)) satellite. This satellite captures images of the Earth’s surface in 1-2 day intervals, with spatial resolution of 1000m. Data are available from March 5, 2000 to present. In addition to temperature, the MODIS satellite captures data on other climate and Earth-based variables (e.g. vegetation indices).
Using the Earth Engine Code Editor, users can manipulate these data over a shorter time period. The tool provides LST long-term and short-term time series for user-defined regions and time periods. This tool will restrict data from March 5, 2000 to present.

### 1. Pull in shape file of Uganda 

In these lines of code, you are creating a new variable called "region". Concretely, you are pulling in a `FeatureCollection` object, and filtering by ‘Country’ to select ‘Uganda.’ FeatureCollections are groups of features (spatial data and attributes). `Filter` is the command to extract a specific set of feature data from a feature collection. You then map it using `Map.addLayer()`.
```javascript
// Import vector file with country boundaries from Earth Engine
var dataset = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017'); // All countries
var uganda_border = dataset.filter(ee.Filter.eq("country_na","Uganda")); 
// apply filter where "country names" equals "Uganda"
print(uganda_border); 
// print to ensure that new "uganda_border" object just contains polygon for Uganda

// Add region outline to layer - for selected countries
Map.addLayer(uganda_border);
```
### 2. Read in land surface data

Next, you need to read in land surface f data. `ImageCollection` objects store collections of images. Using the Earth Engine Data Catalog, you can find different image collections. The `ImageCollection` you are reading in here contains the LST data, but you can read in a different `ImageCollection` for other types of data (e.g. vegetation index, or rain fall, light at night).
The code below applies filters to restrict images for Uganda, within January to December 2015, inclusive.
```javascript
var modis = ee.ImageCollection('MODIS/MOD11A2'); // read in image collection
var start = ee.Date('2015-01-01'); // set start date
var dateRange = ee.DateRange(start, start.advance(1, 'year'));
// set end date 1 year
var mod11a2 = modis.filterDate(dateRange).filterBounds(uganda_border);
// apply filter on date range, uganda boundary

var modLSTday = mod11a2.select('LST_Day_1km'); // pull just 1km day LST
```
### 3. Create function to convert temperature units

Converting temperature from Kelvin to Celsius will make results easier to interpret. Note that for remote sensing data, sometimes equations required to convert between different units require data-specific scaling factors, so you should always make sure to check the appropriate documentation. In this case, you should refer to the MODIS LST User Guide [documentation](https://icess.eri.ucsb.edu/modis/LstUsrGuide/usrguide_mod11.html#sds) for the specific product you are using when doing conversions.   After referring to the documentation, you will learn that in addition to subtracting 273.15, you must multiply the Kelvin value from the MODIS data by a factor of 0.02.

In addition, you will want to keep information about the start and end time for each image in the collection so that the time series can be plotted.

Both steps can be accomplished together by writing a function to do the conversion, keeping the start and end times using the `copyProperties()` function, and then by mapping over the `ImageCollection`. Running this code will generate a new `ImageCollection` called 'modLSTc' (MODIS LST converted) with LST in Celsius, along with the specific time periods needed for the chart.
```javascript
// convert from Kelvin to Celsius and keep start and end times
var modLSTc = modLSTday.map(function(img) {
  return img.multiply(0.02).subtract(273.15).copyProperties(img,['system:time_start','system:time_end']);
}); // this will apply the correction
```
### 4. Describe land surface temperature data using time series

It can be helpful to describe your data using a time series graph. You can plot the mean land surface temperature over the year using the following code. Specifically, you will create a new chart called 'TS1' (time series chart 1) using the `ui.Chart.image.series()` function. This function takes several arguments. First, you bring in your converted `ImageCollection` (modLSTc). Next, you specify the geographic area by calling your 'ug' feature defining the boundary you are interested in. Next, you apply the `ee.Reducer.mean()` function to calculate the mean LST for each image. Specify '1000' as a scale (the LST data have 1km resolution). You should then specify the 'system:time_start' as the x-axis for your chart.

Calling the `setOptions` function allows you to specify labels for the title and y-axis of the chart.
```javascript
// Charts Long-term Time Series
var ts1 = ui.Chart.image.series(modLSTc, uganda_border,
 ee.Reducer.mean(), 1000, 'system:time_start').setOptions({
   title: 'LST Long-Term Time Series',
   vAxis: {title: 'LST Celsius'},
 });
 print(ts1);
```

### 5. Visualize processed data on map

The previous step allowed you to generate a descriptive time series chart. In addition, you may want to visualize your data on the map. You can take the mean LST in celsius, and clip to Uganda. This code produces a map of the mean temperatures that can be viewed in the map window.
```javascript
var clippedLSTc = modLSTc.mean().clip(uganda_border);
// Add clipped image layer to map
Map.addLayer(clippedLSTc, {'min': 0, 'max': 40, 'palette':"blue,limegreen,yellow,darkorange,red"});
```
### 6. Export data for further analysis

Finally, you can export your raster image file to perform further analysis (e.g. link to participant or clinic data). You can use the export command below to download the processed image data to your Google Drive folder. Concretely, calling `Export.image.toDrive()` will allow the user to save the exported image in their Google Drive folder. You can specify the location when downloading the image from the "Tasks" window in the console. As you have named the "description" 'LST_Celsius_ug', this will be the name of the exported file. You can change the name by changing the 'description'.
```javascript
Export.image.toDrive({
        image: clippedLSTc,
        description: 'LST_Celsius_ug',
        region: uganda_border,
        scale: 1000,
        crs: 'EPSG:4326',
        maxPixels: 1e10
      });    
```
With that, you have successfully described, processed, and exported land surface temperature data for 2015 in Uganda.
