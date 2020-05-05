---
title: Exporting multiple rasters based on user-defined dates
description: In this tutorial, we will learn how to export multiple Light At Night (LAN) rasters for the same month over multiple years.
author: hiyer09
tags: exporting data, rasters, loops, Africa, public health
date_published: 2019-09-18
---

[Open In Code Editor](https://code.earthengine.google.com/2d3ad0c07630e858f0274d86a207d994)

It is desirable to export multiple raster images for environmental public health research. Typically the research question will guide the temporal resolution, but in most cases having multiple images over the course of the year is useful to interrogate possible seasonal patterns in exposure-disease relationships.

In this tutorial, we will demonstrate one approach to pre-specifying the season, and then pulling one raster per season per year. For our exposure data, we will use Light At Night (LAN) data. We will conduct this analysis for Botswana.

## Step 1: Draw a polygon around Botswana

Use the polygon tool in the map window to draw a polygon. This polygon will be called `geometry` and be imported to the top of the program as an object. We can then define this object in our code as `region`. Alternatively, we can rename `geometry` to `region` by clicking on imports in the top of the code editor, and clicking on geometry to rename it. As a third option, we can rename it by selecting the "Geometry Imports" panel and then clicking the settings wheel to open options for the polygon object.

```
var region = geometry;
```

## Step 2: Set up date variables

Let's say we are interested in exporting LAN data for the years 2000, 2001, and 2002. We represent the list of years in Google Earth Engine as an array:

```
// specify years -> can extend this code by adding years to the array

var years = ["2000", "2001", "2002"];
print(years);
```

Next, we need to define our start and end dates to filter the image collection. We can do this by defining functions. Note that you can adapt the array to store additional start and end dates for additional months (e.g. April, July, September) by adding additional elements to the arrays. We also want to iterate over years for this, so we are writing a function to add the year that we have predefined to the MM-DD strings.

```
// create array of dates for start -> can extend this code by adding "yr + "" to each element
// in the array

var makeStart = function(yr) {
  var startArray = [yr + "-01-01"]; 
  return(startArray);
};

// create array of dates for end
var makeEnd = function(yr) {
   var endArray = [yr + "-12-31"];
   return(endArray);
};
```
## Step 3: Write function to apply filters and processing data for export

In this step, we are going to perform the following tasks in sequence as part of a function called `getImage`:

1. We first have to tell Google Earth Engine that the dates we have defined above are in fact date variables
2. Next, we filter on the start and end dates specified earlier, and the region object we defined by drawing a polygon around Botswana
3. It's good practice to check how many images we get - we want to just keep one
4. We take the earlier image by sorting on this element in the data
5. Our function spits out a single image in Botswana for the season we specify

```
// Write a function to grab image with data you need
var getImage = function(bdt, edt) {
  
  var start = ee.Date(bdt); // this is converting the inputted element from stArray to date
  var end = ee.Date(edt); // this is converting the inputted element from eArray to date

// Apply filter to a set of images
  var lanset = ee.ImageCollection("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS") // lanset = Light At Night (lan) set of images
    .filterDate(start,end) // search within start, end dates
    .filterBounds(region); // define polygon (can draw or import)


  //How many images?
  print(lanset, "print lanset"); // this tells us the type of object we are looking at
  var count = lanset.size(); // this tells us how many images meet criteria
  print(count); // print shows us output
  
  // take earliest
  var recent = ee.Image(lanset.sort('system:time_start').first()); 
  // this code is important. We are going from "ImageCollection" to "Image" using
  // ee.Image, and then we apply a 'sort' function on 'system:time_start' to get 
  // earliest image

  print(recent, "print recent"); // sanity check to make sure we have the image
  return recent; // we output the image we have selected
};
```
## Step 4: Export our rasters to Google Drive

In this code, we are combining the functions we defined earlier to produce a set of seasonal images for each year. In this case, because we have only defined a single season (January), we will end up with 3 raster image files (for 01-2000, 01-2001, 01-2002). We perform the following steps:

1. We create counters for year, and season, allowing us to iterate over the elements in those arrays
2. We pull our image using the `getImage` function
3. We pull the bands that we want to use for our analysis - in this case, it is the `avg_vis` variable with average digital band numbers for observations with cloud-free light detection
4. We then use the `image.toDrive` command to export the raster to our Google Drive. Our loops allow this to happen in sequence, and then we can hit "RUN" in the tasks window to download the rasters (note the scale: 1000, and crs before pulling into another package to link with spatial health data).

```
// use loops over years, start, end dates to pull images

var i; // year counter
for (i = 0; i < years.length; i++) { // years
    var j; // MM-DD counter
    for (j=0; j < 1; j++){ // change for number of elements in stArr
      var img = GetImage(makeStart(years[i])[j], makeEnd(years[i])[j]);
      var imglan = img.select("avg_vis"); // important - this is the data we want to pull from
      // raster
      print(imglan); // this is the final raster
      
      Export.image.toDrive({ // export to your Google Drive
        image: imglan,
        description: 'lan'+ makeSt(years[i])[j],
        region: region,
        scale: 1000,
        crs: 'EPSG:4326',
        maxPixels: 362706264,
      });
      
    }
}
```

This tutorial has shown how to pull multiple rasters and pre-specify dates of interest for a particular country. You can adapt the shape easily by drawing a different polygon, and can change dates to fit your data and research question.
