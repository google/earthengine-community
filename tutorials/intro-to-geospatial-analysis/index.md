---
title: An Introduction to Geospatial Analysis
description: This workshop provides a fundamental overview of remote sensing and geospatial analysis using the JavaScript API of Earth Engine.
author: TC25
tags: introductory, GIS, remote sensing, Google Earth Engine
date_published: 2019-10-05
---

[Geometries - Open In Code Editor](https://code.earthengine.google.com/d2f8fc328c747296c610f0aafb15407a)

[Features - Open In Code Editor](https://code.earthengine.google.com/1cc3ba5b1a6820c4f03804ead3123400)

[Images - Open In Code Editor - Geometries](https://code.earthengine.google.com/2ba5e30e1178134ca60e59fca36ec925)

We will introduce types of geospatial data, using these data on the Earth Engine platforms, and discuss a host of functionality to visualize and analyze them. This workshop was originally created for a workshop during Yale-NUS Data 2.0 hackathon and then updated for Yale GIS Day 2018. 

## Introduction
Collection, visualization, and analysis of geographical or spatial data.

## Data types

- Vector data represent lat-long coordinates

- Raster data comprises of pixels with associated values

---


- Points

![Points](points.png)

- Lines

![Lines](line-vector.png)

- Polygons

![Polygons](polygon-vector.png)

- Raster layers/bands

![Raster](map-algebra.png)


---

## Google Earth Engine platform

[Introductory video](https://www.youtube.com/watch?v=gKGOeTFHnKY&feature=youtu.be, "Video")

[Code Editor](https://code.earthengine.google.com/ "Earth Engine Code Editor")

- Cloud-based platform for planetary scale geospatial analysis
- Uses Google's computational resources to reduce processing time
- Massive archive of remote sensing data 
- 200+ public datasets 
- greater than 4000 new images every day 
- greater than 5 million images 
- greater than 5 petabytes of data

Source: Google Earth Engine User summit

---

![Code Editor (Source: developers.google.com)](ee-editor.png)

---

## Basic Functions

### Declaring variables
```javascript
var variableName = ee.ContainerType(value); 
```
A container (in the form ee.variabletype) is used to wrap up a native javascript object type so that Google's server can recognize its structure and perform operations on it

###  Centering map
```javascript
Map.setCenter(long, lat, zoom level);
```
>Zoom level varies from 0 (no zoom) to 20 (highest zoom level)

### Displaying metadata
```javascript
print(variableName)
```
You cannot print more than 5000 elements at once

### Adding a layer to the map
```javascript
Map.addLayer(variableName);
```

---

## Variable types in Earth Engine

### Strings

```javascript
var str = ee.String("This is a string. Or is it? It is.");
```
### Numbers
```javascript
var num = ee.Number(5);
```

### Arrays
```javascript
var arr = ee.Array([[5, 2, 3],  [-2, 7, 10],  [6, 6, 9]]);
```

### Lists
```javascript
var lis = ee.List([5, "five" , 6, "six"]);
```
### Dictionaries
```javascript
var dict = ee.Dictionary({five: 5 , six: 6});
```

### And the fun stuff
- Geometries
- Features
- Feature Collections
- Images
- Image Collections

---

## Geometries – declaration and types

### Points
```javascript
var poi = ee.Geometry.Point(0, 45);
```
### Multi Points
```javascript
var multi = ee.Geometry.MultiPoint(0, 45, 5,6, 70,-56);
```
### Line String
```javascript
var lineStr = ee.Geometry.LineString([[0, 45], [5,6], [70,-56]]);
```
### Multi Line String
```javascript
var mlineStr = ee.Geometry.MultiLineString([[[0, 45], [5,6], [70,-56]], [[0, -45], [-5,-6], [-70,56]]]);
```
### Linear Ring
```javascript
var linRin = ee.Geometry.LinearRing(0, 45, 5,6, 70,-56, 0,45);
```
### Rectangle
```javascript
var rect = ee.Geometry.Rectangle(0, 0, 60,30);
```
### Polygon
```javascript
var poly = ee.Geometry.Polygon([[[0, 0], [6,3], [5, 5], [-30,2], [0,0]]]);
```
### Multi Polygon
```javascript
var multiPoly = ee.Geometry.MultiPolygon([ee.Geometry.Polygon([[0, 0], [6, 3], [5, 5], [-30, 2], [0,0]]), ee.Geometry.Polygon([[0, 0], [-6, -3], [-5, -5], [30, -2], [0, 0]])]);
```

---

## Features and Feature Collections

- Features are geometries associated with specific properties
- Feature Collections are groups of features


![Chicago map by neighborhood](chicago-census.png)

---

## Functions and mapping

- A set of instructions to perform a specific task
```javascript
function functionName(Arguments) {statements};
```
### Call function
```javascript
var result = functionName(input);
```

### Map function over Feature or Image Collection
```javascript
var result = input.map(functionName);
```
Mapping a function over a collection sends the each element of the collection to a different server to be processes.

---


## Operations on Geometries

[Geometry operations](https://code.earthengine.google.com/d2f8fc328c747296c610f0aafb15407a "EE Geometry operations")

### Find area of geometry
```javascript
var geoArea = geometry.area();
```

All units in Earth Engine are in meters

### Find length of line
```javascript
var linLen = lineString.length();
```
### Find perimeter of geometry
```javascript
var geoPeri = geometry.perimeter();
```

### Reduce number of vertices in geometry
```javascript
var simpGeo = geometry.simplify(100);
```
### Find centroid of geometry
```javascript
var centrGeo = geometry.centroid();
```
### Create buffer around geometry
```javascript
var buffGeo = geometry.buffer(100);
```
### Find bounded rectangle of the Geometry
```javascript
var bounGeo = geometry.bounds();
```
### Find the smallest envelope that can envelop the Geometry
```javascript
var convexGeo = geometry.convexHull();
```
### Find common area between two or more geometries
```javascript
var interGeo = geometry1.intersection(geometry2);
```
### Find area that includes two or more geometries
```javascript
var unGeo = geometry1.union(geometry2);
```
---
## Operations on Features

[Feature operations](https://code.earthengine.google.com/1cc3ba5b1a6820c4f03804ead3123400 "EE Feature operations")

### Set property name and value of geometry to create a feature
```javascript
var feat = ee.Feature(geometry, {Name: "Feature name", Size: 500};
```
### Create a new feature from existing feature while renaming a property
```javascript
var featNew = feature.select(["Name"], ["Descriptor"]);
```
### Extract values of a property from a Feature
```javascript
var featVal = feature.get("Size");
```
---

## Filters

### Creator a filter for values of a property

```javascript
var bFilter = ee.Filter.eq(propertyName, value);
```
>or .neq , .gt , .gte , .lt , and .lte

### Create a filter based on maximum difference from a threshold

```javascript
var diffFilter = ee.Filter.maxDifference(threshold, propertyName, value);
```

### Create a text filter

```javascript
var txtFilter = ee.Filter.stringContains(propertyName, stringValue);
```

>or .stringStartsWith, and .stringEndsWith

### Create a range filter

```javascript
var rangeFilter = ee.Filter.rangeContains(propertyName, stringValue, minValue, maxValue);
```
  
### Create a list filter to check for certain values

```javascript
var listFilter = ee.Filter.listContains(propertyName, value1, propertyName2, value2);
```
>.inList to test against list of values

### Create a filter of dates

```javascript
var dateFilter = ee.Filter.calendarRange(startDate, stopDate);
```

### Create a filter for particular days of the year

```javascript
var dayFilter = ee.Filter.dayOfYear(startDay, stopDay);
```

### Create a filter to subset geospatial data

```javascript
var boundsFilter = ee.Filter.bounds(geometryOrFeature);
```
### Combining and inversing filters

```javascript
var newFilter = ee.Filter.and(listOfFilters);
var newFilter = ee.Filter.or(listOfFilters);
var inverseFilter = ee.Filter.not(filter);
```
---
## Operations on Images

[Image operations](https://code.earthengine.google.com/2ba5e30e1178134ca60e59fca36ec925 "EE Image operations")

### Selecting the bands of an image
```javascript
var band = var_Image.select(bandName);
```
### Creating masks
```javascript
var mask = image.eq(value);
```
>or .neq or .gt or .gte or .lt or .lte

### Applying masks
```javascript
var masked = image.mask(mask);
```

### Pixelwise calculation
```javascript
var results = image.sum(value);
```
>or .subtract ,    .multiply ,    .divide ,    .max , .min ,  .abs ,  .round ,  .floor ,  .ceil ,  .sqrt ,  .exp,  .log, .log10, .sin ,  .cos ,  .tan ,  .sinh ,  .cosh ,  .tanh ,  .acos, .asin

### Shift pixels of an image
```javascript
newImage = oldImage.leftShift(valueOfShift);                   
```
>or .rightShift

### Create a single value from an image by applying a reducer based on regions of interest

```javascript
var outputDictionary = var_Image.reduceRegion(reducer, geometry, scale);
```

---

# Operations on Image Collections

### Select the first n numbers of images in a collection (based on property)

```javascript
var selectedImages = imCollection.limit(n, propertyName, order);
```

### Select images in collection based on particular properties

```javascript
var selectedIm = imCollection.filterMetadata(propertyName, relation , value);
```
>Relations could be "equals", "less_than", "greater_than", "starts_with", "ends_with", and "contains"

### Select images within date range
```javascript
var selectedIm = imCollection.filterDate(startDate, stopDate);
```

### Select images within Geometry
```javascript
var selectedIm = imCollection.filterBounds(geometry);
```

### Perform pixelwise calculations for all images in collection
```javascript
var sumOfImages = imCollection.sum();
```
>or .product, .max, .min, .mean, .mode, .median, and .count 

### Create composite of images in collection with the last image on top

```javascript
var mosaicOfImages = imCollection.mosaic();
```
---
## Importing and exporting data

[Image to table example](https://code.earthengine.google.com/8f0cb58828c12123a234eb196bc4fb6f "Image to table example")

[Timelapse example](https://code.earthengine.google.com/1b4a4f83c5af8fa9b0404c9897a89b84 "Timelapse example")

[Dubai timelapse](https://www.youtube.com/watch?v=6gK4Fd-WSM4&feature=youtu.be "Dubai timelapse")

![Urban growth in Dubai](dubai-change.png)



### Export image, video or table to Google Drive, Asset, or Google Cloud

```javascript
Export.image.toDrive({
  collection: varImage, description: 'fileName', region: geometry, scale: 1000}
});
```
>or image.toCloudStorage, image.toAsset, table.toDrive, table.toCloudStorage, video.toCloudStorage, and video.toDrive

---

## Example Applications

 What can you do with Google Earth Engine?

### [EE Population Explorer](https://code.earthengine.google.com/f5c100f29958f6fe82ba5d0dcf6421a4 "EE Population Explorer")

### [EE Ocean Time Series Investigator](https://code.earthengine.google.com/901e5a356ef3d260a5ff542598667044 "EE Ocean Time Series Investigator")

### [Global Surface UHI Explorer](https://yceo.users.earthengine.app/view/uhimap "Global Surface UHI Explorer")

### [Stratifi - cloud-based stratification](https://sabrinaszeto.users.earthengine.app/view/stratifi "Stratifi - cloud-based stratification")
---

## Resources


[Geospatial Software Design](https://environment.yale.edu/courses/2018-2019/detail/754/ "Geospatial Software Design")

[Google Earth Engine API documentation](https://developers.google.com/earth-engine/ "Google Earth Engine API documentation")

[Google Earth Engine Developers forum](https://groups.google.com/forum/#!forum/google-earth-engine-developers "Google Earth Engine Developers forum")

[Example scripts from Prof. Dana Tomlin's handouts for his course on Geospatial Software Design](https://github.com/EEYale/example-scripts "Example scripts from Prof. Dana Tomlin's handouts for his course on Geospatial Software Design")
