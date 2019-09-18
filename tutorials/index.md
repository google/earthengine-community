---
title: Earth Engine for Public Health Land Surface Temperature Example Uganda
description: This tutorial shows how to describe, visualize, and export Earth Engine exposure data for public health research.
author: hiyer20
tags: comma-separated, lowercase, list, of, related, keywords
date_published: 2019-09-17
---


---
title: Earth Engine for Public Health Land Surface Temperature in Uganda Example

---

[Open In Code Editor](https://code.earthengine.google.com/1a68fa019a5175a0250ecba425ae5e0d)

Learning objectives:
•	Introduce remote sensing data.
•	Learn how to obtain and process raster climate data in Google Earth Engine.

Remote sensing (satellite-derived) data are a rich source of information about climate variables, including land cover, vegetation, rainfall, and temperature. Satellite data are available going back to the 1980s in many cases, and so they provide a means for doing historical analyses of changing geographies that can be linked with epidemiologic data for analysis.
In this exercise, we will learn how to acquire remote sensing data from Google Earth Engine. We will learn how to perform time series analysis to study changes in climate variables over our chosen geography and time period. We will also apply some common geospatial procedures (zonal, focal statistics). Finally, we will learn how to export our Earth Engine raster files to Google Drive. 


## Writing a simple Javascript program to extract and process data

We will analyze Land Surface Temperature (LST) data collected using the Moderate Resolution Imaging Spectroradiometer (MODIS) satellite. This satellite captures images of the Earth’s surface in 1-2 day intervals, with spatial resolution of 1000m. Data are available from March 5, 2000 to the present. In addition to temperature, the MODIS satellite captures data on other climate and Earth-based variables (e.g. vegetation indices).
Using the Earth Engine code editor, users can manipulate these data over a shorter time period. The tool provides LST long-term and short-term time series for user-defined regions and time periods. This tool will restrict data from March 5, 2000 to the present. 

1. Pull in a shape file of Uganda. 

In these lines of code, we are creating a new variable called region as before. However, now we are pulling in a “FeatureCollection” object, and filtering by ‘Country’ to select ‘Uganda.’ FeatureCollections are groups of features (spatial data and attributes). “Filter” is the command to extract a specific set of feature data from a feature collection. We then map it.

```
var ug = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw') 
  .filter(ee.Filter.eq('Country', 'Uganda'));

Map.addLayer(ug)
```
Now, we need to read in land surface temperature data. 'ImageCollection' objects store collections of images. Using the Earth Engine Data Catalog, we can find different image collections. The 'ImageCollection' we are reading in here contains the LST data, but we can read in a different 'ImageCollection' for other types of data (e.g. vegetation index, or rain fall, light at night).
Our code applies filters to restrict images for Uganda, within January to December 2015.

```

var modis = ee.ImageCollection('MODIS/MOD11A2') // read in image collection

var mod11a2 = modis.
  filterBounds(ug). // just pull for Uganda
  filterDate('2015-01-01', '2015-12-31'); // take 1 year (2015)

var modLSTday = mod11a2.select('LST_Day_1km'); // pull just 1km day LST

```
We then need to convert temperature from Kelvin to Celsius. We can do this by writing a function to do the conversion, and then by mapping over the data.

```
var modLSTc = modLSTday.map(function(img) {
  return img.multiply(0.02).subtract(273.15).copyProperties(img,['system:time_start','system:time_end']); 
}); 

```
It can be helpful to describe your data using a time series graph. We can plot the mean land surface temperature over the year using the following code:


// Charts Long-term Time Series
var TS1 = ui.Chart.image.series(modLSTc, ug,
 ee.Reducer.mean(), 1000, 'system:time_start').setOptions({
   title: 'LST Long-Term Time Series',
   vAxis: {title: 'LST Celsius'},
 });
 print(TS1);


Break up your tutorial into manageable sections.

With one or more paragraphs, separated by a blank line.

Inside your sections, you can also:

1. Use numbered lists
1. ..when the order..
1. ..of items is important.

And:

- This is a bulleted list.
- Use bulleted lists when items are not strictly ordered.

..and even:

Use     | tables   | to organize | content
------- | -------- | ----------- | -------
Your    | tables   | can         | also
contain | multiple | rows        | ...

## Section heading 2

Use separate sections for related, but discrete, groups of steps.

Use code blocks to show users how to do something after describing it:

```
// Use comments to describe details that can't be easily expressed in code.
// Always try making code more self descriptive before adding a comment.
// Similarly, avoid repeating verbatim what's already said in code
// (e.g., "assign ImageCollection to variable 'coll'").
var coll = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');
```

### Use subsections if appropriate

Consider breaking longer sections that cover multiple topics or span multiple
pages into subsections.
