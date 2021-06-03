---
title: Extracting Raster Values for Points
description: How to extract raster values for points and polygons.
author: swinsem
tags: raster, image, point, polygon, plot, time-series, landsat, reduce
date_published: 2021-01-12
---
<!--
Copyright 2020 The Google Earth Engine Community Authors

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

_This tutorial uses the [Earth Engine Code Editor JavaScript API](https://developers.google.com/earth-engine/guides/playground)._

Extracting raster values for points or plots is essential for many types of
projects. This tutorial will show you how to use Earth Engine to get a full
time series of image values for points or plots in your dataset. We will lay
out the process and functions for how to extract raster values for points
using any dataset and then apply them to a few examples.

## Context

Anyone working with field data collected in plots will likely need to extract
raster data for those plots at some point. The Normalized Difference
Vegetation Index (NDVI), for example, is commonly used as a measure for
vegetation greenness and can be calculated from a wide variety of satellite
datasets. You may also want to use climate data for your plots, or extract
reflectance for satellite multispectral bands so you can calculate your own
indices later. This process works for a single image or image collections.
Running the process over an image collection will produce a table with values
from each image in the collection per point. Image collections can be
processed before extraction as needed, for example by masking clouds from
satellite imagery or by constraining the dates needed for a particular
research question. In this tutorial, the data extracted from rasters are
exported to a table for analysis, where each row of the table corresponds to
a unique point-image combination.

In fieldwork, researchers often work with plots, which are commonly recorded
as polygon files or as a center point with a set radius. It is rare that
plots will be set directly in the center of pixels from your desired raster
dataset, and many field GPS units have positioning errors. Because of these
issues, it may be important to use the average of adjacent pixels to estimate
the central value, or ‘neighborhood’ mean
([Miller and Thode 2007, Cansler and McKenzie 2012](#references)). This is
sometimes referred to as a focal
mean or a weighted mean. To choose the size of your neighborhood, you will
need to consider your research questions, the spatial resolution of the
dataset, the size of your field plot, and the error from your GPS. For
example, the raster value extracted for randomly placed 20 m diameter plots
would likely merit use of a neighborhood mean when using Sentinel-2 or Landsat
8, at 10 and 30 m spatial resolution respectively, while using a thermal band
from MODIS at 1000 m may not. While much of this tutorial is written with plot
points and buffers in mind, a polygon asset with predefined regions will serve
the same purpose.

## Functions

Two functions are provided; **copy and paste them into your script**:

- A function to generate circular or square regions from buffered points.
- A function to extract image pixel neighborhood statistics for a given region.

### bufferPoints(radius, bounds) ⇒ `Function`

`bufferPoints`  is a function generator that returns a function for adding a
buffer to points and
optionally transforming to rectangular bounds.

| Param | Type | Description |
| --- | --- | --- |
| radius | `Number` | Buffer radius (m). |
| [bounds=false] | `Boolean` | An optional flag indicating whether to transform buffered point (circle) to rectangular bounds or not. |

```js
function bufferPoints(radius, bounds) {
  return function(pt) {
    pt = ee.Feature(pt);
    return bounds ? pt.buffer(radius).bounds() : pt.buffer(radius);
  };
}
```

### zonalStats(fc, params) ⇒ `ee.FeatureCollection`

`zonalStats` is a function for reducing images in an image collection by
regions defined in a feature collection. Note that reductions that return
null statistics are filtered out of the resulting feature collection. Null
statistics occur when there are no valid pixels intersecting the region being
reduced. This situation can be caused by points that are outside of an image
or image regions are masked for quality or clouds.

| Param | Type | Description |
| --- | --- | --- |
| ic | `ee.ImageCollection` | Image collection to extract values from. |
| fc | `ee.FeatureCollection` | Feature collection that provides regions to reduce image  pixels by. |
| [params] | `Object` | An optional Object that provides function arguments. |
| [params.reducer=ee.Reducer.mean()] | `ee.Reducer` | The reducer to apply. Optional. |
| [params.scale=null] | `Number` | A nominal scale in meters of the projection to work in. If null, the native nominal image scale is used. Optional. |
| [params.crs=null]| `String` | The projection to work in. If null, the native image CRS is used. Optional. |
| [params.bands=null] | `Array` | A list of image band names to reduce values for. If null, all bands will be reduced. Band names define column names in the resulting reduction table. Optional. |
| [params.bandsRename=null] | `Array` | A list of desired image band names. The length and order must correspond to the `params.bands` list. If null, band names will be unchanged. Band names define column names in the resulting reduction table. Optional. |
| [params.imgProps=null] | `Array` | A list of image properties to include in the table of region reduction results. If null, all image properties are included. Optional. |
| [params.imgPropsRename=null] | `Array` | A list of image property names to replace those provided by `params.imgProps`. The length and order must match the `params.imgProps` entries. Optional. |

```js
function zonalStats(ic, fc, params) {
  // Initialize internal params dictionary.
  var _params = {
    reducer: ee.Reducer.mean(),
    scale: null,
    crs: null,
    bands: null,
    bandsRename: null,
    imgProps: null,
    imgPropsRename: null,
    datetimeName: 'datetime',
    datetimeFormat: 'YYYY-MM-dd HH:mm:ss'
  };

  // Replace initialized params with provided params.
  if (params) {
    for (var param in params) {
      _params[param] = params[param] || _params[param];
    }
  }

  // Set default parameters based on an image representative.
  var imgRep = ic.first();
  var nonSystemImgProps = ee.Feature(null)
    .copyProperties(imgRep).propertyNames();
  if (!_params.bands) _params.bands = imgRep.bandNames();
  if (!_params.bandsRename) _params.bandsRename = _params.bands;
  if (!_params.imgProps) _params.imgProps = nonSystemImgProps;
  if (!_params.imgPropsRename) _params.imgPropsRename = _params.imgProps;

  // Map the reduceRegions function over the image collection.
  var results = ic.map(function(img) {
    // Select bands (optionally rename), set a datetime & timestamp property.
    img = ee.Image(img.select(_params.bands, _params.bandsRename))
      .set(_params.datetimeName, img.date().format(_params.datetimeFormat))
      .set('timestamp', img.get('system:time_start'));

    // Define final image property dictionary to set in output features.
    var propsFrom = ee.List(_params.imgProps)
      .cat(ee.List([_params.datetimeName, 'timestamp']));
    var propsTo = ee.List(_params.imgPropsRename)
      .cat(ee.List([_params.datetimeName, 'timestamp']));
    var imgProps = img.toDictionary(propsFrom).rename(propsFrom, propsTo);

    // Subset points that intersect the given image.
    var fcSub = fc.filterBounds(img.geometry());

    // Reduce the image by regions.
    return img.reduceRegions({
      collection: fcSub,
      reducer: _params.reducer,
      scale: _params.scale,
      crs: _params.crs
    })
    // Add metadata to each feature.
    .map(function(f) {
      return f.set(imgProps);
    });
  }).flatten().filter(ee.Filter.notNull(_params.bandsRename));

  return results;
}
```

## Point collection import

If the points or polygons you want to extract raster statistics for are
stored in a local shapefile or csv file, first [upload the data to your Earth
Engine assets](https://developers.google.com/earth-engine/guides/importing).
All columns in your vector file, such as the plot name, will be retained
through this process.

Assuming you have an Earth Engine table asset ready,
[import the asset](https://developers.google.com/earth-engine/guides/asset_manager#importing-assets-to-your-script)
into your script by hovering over the name of the
asset and clicking the arrow at the right side, or by calling it in your
script with the following code:

```js
var pts = ee.FeatureCollection('users/yourUsername/yourAsset');
```

If you prefer to define points dynamically, you can add them to your script
using the [geometry tools](https://developers.google.com/earth-engine/guides/playground#geometry-tools),
or code them as a `FeatureCollection` like we'll do here.

**The following points will be used for the remainder of the tutorial**. Note
that a unique `plot_id` property is added to each point. A unique plot or
point ID is important to include in your vector dataset for future filtering
and joining.

```js
var pts = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-118.6010, 37.0777]), {plot_id: 1}),
  ee.Feature(ee.Geometry.Point([-118.5896, 37.0778]), {plot_id: 2}),
  ee.Feature(ee.Geometry.Point([-118.5842, 37.0805]), {plot_id: 3}),
  ee.Feature(ee.Geometry.Point([-118.5994, 37.0936]), {plot_id: 4}),
  ee.Feature(ee.Geometry.Point([-118.5861, 37.0567]), {plot_id: 5})
]);
```

## Neighborhood statistic examples

The following examples demonstrate extracting raster neighborhood statistics
for:

- A single raster with elevation and slope bands.
- A multi-band MODIS time series.
- A multi-band Landsat time series.

In each example, the points imported in the previous section will be buffered
and then used as regions to extract zonal statistics for each image in the
respective image collection.

### Topographic variables

This example demonstrates how to calculate zonal statistics for a single,
multi-band image. The image contains topographic bands representing elevation
and slope.

#### Buffer the points

Apply a 45 m radius buffer to the points defined previously by mapping the
`bufferPoints` function over the feature collection. The radius is set to 45
m to correspond to the 90 m pixel resolution of the DEM. In this case,
circles are used instead of squares (set the second argument as `false`
i.e., do not use bounds).

```js
var ptsTopo = pts.map(bufferPoints(45, false));
```

#### Calculate zonal statistics

Two important things to note about the `zonalStats` function that this
example addresses:

- It only accepts an `ee.ImageCollection` , not an `ee.Image`; single images
    must be wrapped in an image collection.
- It expects every image in the input image collection to have a timestamp
    property named `'system:time_start'` with values representing milliseconds
    from 00:00:00 UTC on 1 January 1970; most datasets should have this
	property, otherwise one should be added.

```js
// Import the MERIT global elevation dataset.
var elev = ee.Image('MERIT/DEM/v1_0_3');

// Calculate slope from the DEM.
var slope = ee.Terrain.slope(elev);

// Concatenate elevation and slope as two bands of an image.
var topo = ee.Image.cat(elev, slope)
  // Computed images do not have a 'system:time_start' property; add one based
  // on when the data were collected.
  .set('system:time_start', ee.Date('2000-01-01').millis());

// Wrap the single image in an ImageCollection for use in the zonalStats function.
var topoCol = ee.ImageCollection([topo]);
```

Define arguments for the `zonalStats` function and then run it. Note that we
are accepting defaults for the reducer, scale, crs, and image properties to
copy over to the resulting feature collection. Refer to the function
definition above for defaults.

```js
// Define parameters for the zonalStats function.
var params = {
  bands: [0, 1],
  bandsRename: ['elevation', 'slope']
};

// Extract zonal statistics per point per image.
var ptsTopoStats = zonalStats(topoCol, ptsTopo, params);
print(ptsTopoStats);
```

The result is a copy of the buffered point feature collection with new
properties added for the region reduction of each selected image band
according to the given reducer. It is essentially a table that looks like this:

| plot_id | timestamp | datetime | elevation | slope |
| --- | --- | --- | --- | --- |
| 1 | 946684800000 | 2000-01-01 00:01:00 | 2648.1 | 29.7 |
| 2 | 946684800000 | 2000-01-01 00:01:00 | 2888.2 | 33.9 |
| 3 | 946684800000 | 2000-01-01 00:01:00 | 3267.8 | 35.8 |
| 4 | 946684800000 | 2000-01-01 00:01:00 | 2790.7 | 25.1 |
| 5 | 946684800000 | 2000-01-01 00:01:00 | 2559.4 | 29.4 |

### MODIS time series

A time series of [MODIS 8-day surface reflectance](https://developers.google.com/earth-engine/datasets/catalog/MODIS_006_MOD09A1)
composites demonstrates how to calculate zonal statistics for a
multi-band image collection that requires no preprocessing i.e., cloud
masking, computation.

#### Buffer the points

In this example, suppose the point collection represents center points for
field plots that are 100 x 100 m, apply a 50 m radius buffer to the points to
match the size of the plot. Since a square region is needed, set the second
argument of the `bufferPoints` function to `true`, so that the bounds of the
buffered points are returned.

```js
var ptsModis = pts.map(bufferPoints(50, true));
```

#### Calculate zonal statistics

Import the MODIS 500 m global 8-day surface reflectance composite collection
and filter the collection to include data for July, August, and September
from 2015 through 2019.

```js
var modisCol = ee.ImageCollection('MODIS/006/MOD09A1')
  .filterDate('2015-01-01', '2020-01-01')
  .filter(ee.Filter.calendarRange(183, 245, 'DAY_OF_YEAR'));
```

Reduce each image in the collection by each plot according to the following
parameters. Note that this time the reducer is defined as the neighborhood
median (`ee.Reducer.median`) instead of the default mean, and that scale, crs,
and properties for the datetime are explicitly defined.

```js
// Define parameters for the zonalStats function.
var params = {
  reducer: ee.Reducer.median(),
  scale: 500,
  crs: 'EPSG:5070',
  bands: ['sur_refl_b01', 'sur_refl_b02', 'sur_refl_b06'],
  bandsRename: ['modis_red', 'modis_nir', 'modis_swir'],
  datetimeName: 'date',
  datetimeFormat: 'YYYY-MM-dd'
};

// Extract zonal statistics per point per image.
var ptsModisStats = zonalStats(modisCol, ptsModis, params);
print(ptsModisStats.limit(50));
```

The result is a feature collection with a feature for all combinations of
plots and images. Feature properties include those from the plot asset,
respective image date, as well as any respective non-system image properties.

### Landsat time series

This example combines [Landsat surface reflectance](https://developers.google.com/earth-engine/datasets/catalog/landsat)
imagery across three instruments: Thematic Mapper (TM) from Landsat 5,
Enhanced Thematic Mapper Plus (ETM+) from Landsat 7, and Operational Land
Imager (OLI) from Landsat 8.

The following section prepares these collections so that band names are
consistent and cloud masks are applied. Reflectance among corresponding
bands are roughly congruent for the three sensors when using the surface
reflectance product, therefore the processing steps that follow do not
address inter-sensor harmonization. If you would like to apply a correction,
please see the
["Landsat ETM+ to OLI Harmonization" tutorial](https://developers.google.com/earth-engine/tutorials/community/landsat-etm-to-oli-harmonization)
for more information on the subject.

#### Prepare the Landsat image collection

First, define the function to mask cloud and shadow pixels.

```js
function fmask(img) {
  var cloudShadowBitMask = 1 << 3;
  var cloudsBitMask = 1 << 5;
  var qa = img.select('pixel_qa');
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
    .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  return img.updateMask(mask);
}
```

Next, define functions to select and rename the bands of interest for OLI and
TM/ETM+ data. This is important because the band numbers are different
between OLI and TM/ETM+, and it will make future index calculations easier.

```js
// Selects and renames bands of interest for Landsat OLI.
function renameOli(img) {
  return img.select(
    ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'],
    ['Blue', 'Green', 'Red', 'NIR', 'SWIR1', 'SWIR2']);
}

// Selects and renames bands of interest for TM/ETM+.
function renameEtm(img) {
  return img.select(
    ['B1', 'B2', 'B3', 'B4', 'B5', 'B7'],
    ['Blue', 'Green', 'Red', 'NIR', 'SWIR1', 'SWIR2']);
}
```

Combine the cloud mask and band renaming functions into preparation functions
for OLI and TM/ETM+. If you want to include band harmonization coefficients,
you can combine the `prepOli` and `prepEtm` functions from the
["Landsat ETM+ to OLI Harmonization" tutorial](https://developers.google.com/earth-engine/tutorials/community/landsat-etm-to-oli-harmonization)
with the functions below.

```js
// Prepares (cloud masks and renames) OLI images.
function prepOli(img) {
  img = fmask(img);
  img = renameOli(img);
  return img;
}

// Prepares (cloud masks and renames) TM/ETM+ images.
function prepEtm(img) {
  img = fmask(img);
  img = renameEtm(img);
  return img;
}
```

Get the Landsat surface reflectance collections for OLI, ETM+, and TM
sensors. Filter them by the bounds of the point feature collection and apply
the relevant image preparation function.

```js
var ptsLandsat = pts.map(bufferPoints(15, true));

var oliCol = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
  .filterBounds(ptsLandsat)
  .map(prepOli);

var etmCol = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
  .filterBounds(ptsLandsat)
  .map(prepEtm);

var tmCol = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')
  .filterBounds(ptsLandsat)
  .map(prepEtm);
```

Merge the prepared sensor collections.

```js
var landsatCol = oliCol.merge(etmCol).merge(tmCol);
```

#### Calculate zonal statistics

Reduce each image in the collection by each plot according to the following
parameters. Note that this example defines the `imgProps` and
`imgPropsRename` parameters to copy over and rename just two selected image
properties: Landsat image ID and the satellite that collected the data.

```js
// Define parameters for the zonalStats function.
var params = {
  reducer: ee.Reducer.mean(),
  scale: 30,
  crs: 'EPSG:5070',
  bands: ['Blue', 'Green', 'Red', 'NIR', 'SWIR1', 'SWIR2'],
  bandsRename: ['ls_blue', 'ls_green', 'ls_red', 'ls_nir', 'ls_swir1', 'ls_swir2'],
  imgProps: ['LANDSAT_ID', 'SATELLITE'],
  imgPropsRename: ['img_id', 'satellite'],
  datetimeName: 'date',
  datetimeFormat: 'YYYY-MM-dd'
};

// Extract zonal statistics per point per image.
var ptsLandsatStats = zonalStats(landsatCol, ptsLandsat, params);
print(ptsLandsatStats.limit(50));
```

The result is a feature collection with a feature for all combinations of
plots and images.

### Dealing with large collections

If your browser times out, try [exporting](https://developers.google.com/earth-engine/guides/exporting)
the results. It's likely that point feature collections that cover a large area
or contain many points (point-image observations) will need to be exported as a
batch task by either exporting the final feature collection as an asset or as a
CSV/Shapefile/GeoJSON to Google Drive or GCS.

Here is how you would export the above Landsat image-point feature collection
to asset and Google Drive. Run the following code, activate the Code Editor
Tasks tab, and then click the task 'Run' button.

```js
Export.table.toAsset({
  collection: your_feature_collection_goes_here,
  description: 'your_summary_table_name_here',
  assetId: 'path_to_your_summary_table_name_here'
});

Export.table.toDrive({
  collection: your_feature_collection_goes_here,
  folder: 'your_gdrive_folder_name_here',
  description: 'your_summary_table_name_here',
  fileFormat: 'CSV'
});
```

## Additional notes

### Common reducers

- [ee.Reducer.first](https://developers.google.com/earth-engine/apidocs/ee-reducer-first)
- [ee.Reducer.min](https://developers.google.com/earth-engine/apidocs/ee-reducer-min)
- [ee.Reducer.max](https://developers.google.com/earth-engine/apidocs/ee-reducer-max)
- [ee.Reducer.mean](https://developers.google.com/earth-engine/apidocs/ee-reducer-mean)
- [ee.Reducer.mode](https://developers.google.com/earth-engine/apidocs/ee-reducer-mode)
- [ee.Reducer.median](https://developers.google.com/earth-engine/apidocs/ee-reducer-median)
- [ee.Reducer.percentile](https://developers.google.com/earth-engine/apidocs/ee-reducer-percentile)
- [ee.Reducer.minMax](https://developers.google.com/earth-engine/apidocs/ee-reducer-minMax)

### Weighted vs unweighted region reduction

A region used for calculation of zonal statistics often bisects multiple 
pixels. Should partial pixels be included in zonal statistics? Earth Engine
lets you decide by allowing you to define a reducer as
either weighted or unweighted (or you can provide per-pixel weight
specification as an image band). A **weighted** reducer will include partial
pixels in statistic calculations by weighting each pixel's contribution
according to the fraction of the area intersecting the region. An **unweighted**
reducer, on the other hand, gives equal weight to all pixels whose cell center
intersects the region; all other pixels are excluded from calculation of the
statistic. For aggregate reducers like `ee.Reducer.mean()` and
`ee.Reducer.median()`, the default mode is weighted, while identifier reducers
such as `ee.Reducer.min()` and `ee.Reducer.max()` are unweighted. You can adjust
the behavior of weighted reducers by calling `unweighted()` on them, as in
`ee.Reducer.mean().unweighted()`. For more information, please see the
[Weighted Reductions](https://developers.google.com/earth-engine/guides/reducers_weighting)
guide page.

### Copy properties to computed images

Derived computed images do not retain the properties of their source image, so
be sure to copy properties to computed images if you want them included in
the region reduction table. For instance, consider the simple computation of
unscaling Landsat SR data:

```js
// Define a Landsat image.
var img = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR').first();

// Print its properties.
print(img.propertyNames());

// Select the reflectance bands and unscale them.
var computedImg = img.select('B.*').divide(1e4);

// Print the unscaled image's properties.
print(computedImg.propertyNames());
```

Notice how the computed image does not have the source image's properties and
only retains the bands information. To fix this, use the `copyProperties`
function to add the source properties to the derived image.

```js
// Select the reflectance bands and unscale them.
var computedImg = img.select('B.*').divide(1e4)
  .copyProperties(img, img.propertyNames());

// Print the unscaled image's properties.
print(computedImg.propertyNames());
```

Now all of the properties are included.

Use this technique when returning computed, derived images in a mapped
function, and in single image operations.

### Understanding which pixels are included in polygon statistics

If you want to visualize what pixels are included in a polygon for a region
reducer, you can adapt the following code to use your own region(s) by replacing
`geometry` and the `elev` dataset, along with desired scale and crs parameters.
The important part to note is that the image data you are adding to the map
is reprojected using the same `scale` and `crs` as that used in your region
reduction.

```js
// Add polygon geometry.
var geometry =
    ee.Geometry.Polygon(
        [[[-118.6019835717645, 37.079867782687884],
          [-118.6019835717645, 37.07838698844939],
          [-118.60036351751951, 37.07838698844939],
          [-118.60036351751951, 37.079867782687884]]], null, false);

// Import the MERIT global elevation dataset.
var elev = ee.Image('MERIT/DEM/v1_0_3');
print('Projection, crs, and crs_transform:', elev.projection());
print('Scale in meters:', elev.projection().nominalScale());
```

A count reducer will return how many pixel centers are overlapped by the polygon region, 
which would be the number of pixels included in any unweighted reducer statistic. Be sure 
to specify CRS and scale for both the region reducer and the reprojected layer added 
to the map (see below for more details).

```js
var result = elev.select(0).reduceRegion({
  reducer: ee.Reducer.count(),
  geometry: geometry,
  scale: 90,
  crs: 'EPSG:5070'
});

print('n pixels', result.get('dem'));

Map.addLayer(elev.reproject({crs: 'EPSG:5070', scale: 90}),
  {min: 2500, max: 3000, palette: ['blue', 'white', 'red']});
Map.addLayer(geometry, {color: 'white'});
Map.centerObject(geometry, 18);
```

### Notes on CRS and scale:

- Earth Engine runs `reduceRegion` using the projection of the image's first
    band if the CRS is unspecified in the function. For imagery spanning
	multiple UTM zones, for example, this would lead to different origins. For
	some functions EE uses the default EPSG:4326. Therefore, when the
	opportunity is presented, such as by the `reduceRegion` function, it is
	important to specify the scale and CRS explicitly.
- The Map default CRS is EPSG:3857. When looking closely at pixels on the map,
    the data layer scale and CRS should also be set explicitly. Note that
	zooming out after setting a relatively small scale when reprojecting may
	result in memory and/or timeout errors because optimized pyramid layers for
	each zoom level will not be used.
- Specifying the CRS and scale in both the `reduceRegion` and `addLayer`
    functions allow the map visualization to align with the information printed
	in the console.
- The Earth Engine default, WGS 84 lat long (EPSG:4326), is a generic CRS that
    works worldwide. The code above reprojects to EPSG:5070, North American
	Equal Albers, which is a CRS that preserves area for North American
	locations. Use the CRS that is best for your use case when adapting this to
	your own project, or maintain (and specify) the CRS of the image using
	`crs: img.projection()`.

## References

[🔗](https://developers.google.com/earth-engine/tutorials/community/landsat-etm-to-oli-harmonization) Braaten, J. Landsat ETM+ to OLI Harmonization. Google Earth Engine Community Tutorials. 2019, Aug 29.

[🔗](https://www.mdpi.com/2072-4292/4/2/456) Cansler CA, McKenzie D. How robust are burn severity indices when applied in a new region? Evaluation of alternate field-based and remote-sensing methods. Remote Sensing. 2012;4(2):456–483. doi:10.3390/rs4020456

[🔗](https://www.researchgate.net/publication/222816542_Quantifying_burn_severity_in_a_heterogeneous_landscape_with_a_relative_version_of_the_delta_Normalized_Burn_Ratio_RdNBR) Miller JD, Thode AE. Quantifying burn severity in a heterogeneous landscape with a relative version of the delta Normalized Burn Ratio (dNBR). Remote Sensing of Environment. 2007;109(1):66–80. doi:10.1016/j.rse.2006.12.006
