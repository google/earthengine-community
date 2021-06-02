---
title: Synthetic Aperture Radar (SAR) Basics
description: Introduction to Synthetic Aperture Radar (SAR) basics using Sentinel-1 in GEE.
author: glemoine62
tags: SAR, Sentinel-1, Copernicus, radar, microwave, backscattering coefficients, GRD, polarization
date_published: 2020-09-12
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

This tutorial introduces the basics of [Sentinel-1 Algorithms](https://developers.google.com/earth-engine/guides/sentinel1) in Earth Engine. It defines Synthetic Aperture Radar (SAR) terminology and demonstrates data coverage and selection.

We'll introduce more advanced concepts in a later tutorial.

## SAR characteristics

A good introduction to Synthetic Aperture Radar (SAR) basics is [A Tutorial on Synthetic Aperture Radar](https://elib.dlr.de/82313/), created by a group of experts at DLR led by Dr. A. Moreira. The essentials are in part I and II. Advanced polarimetry and interferometry, or combined POLINSAR, (part III *ff*) is currently outside the scope of what is possible in Earth Engine.

A key point about SAR is that it is a radar (RAdio Detection And Ranging) instrument, and its basic measurements are intensity (or amplitude) and phase of the backscattered signal, sampled in time bins along the **azimuth** (along track direction of the sensor antenna) and **range** (across track or perpendicular to the direction of the sensor antenna). These time bins relate to locations on Earth from which the backscattered signals originate. The "Synthetic Aperture" of the SAR relates to the virtual creation of a huge antenna by making use of the sensor motion. The virtual large antenna is needed to ensure an adequate resolution in azimuth. The sorting of the pulsed range echoes and Doppler shifted azimuth samples requires complex raw SAR signal processing (check the reference above if you want more technical details).

The key differences between SAR and optical sensors are:

- SAR is an **active** sensor, transmitting **microwave** radiation, for which it receives the portion **scattered back** to the sensor. Optical sensors are **passive** sensors that register reflected radiation from the Sun in specific parts of the visible and infrared spectrum.
- SAR is **side-looking**, unlike optical sensors which are usually nadir looking. 
- SAR radiation is **coherent**, because the microwave radiation is transmitted with a precise set of wavelengths. This is useful, because it allows precise **phase** and **amplitude** measurements of the backscattered waves and the use of **polarization**. Reflected sunlight is not coherent as it has a wide range of wavelengths and random phase. 

Reflecting on these differences is important, because it is the basis for understanding the relative advantages of SAR compared to optical sensors:

- SAR does not depend on sunlight, thus can produce data **day and night**, provided the sensor is switched on.
- SAR is **insensitive to the atmosphere** in C-band (Sentinel-1 except for very dense rain cells) and L-band (ALOS-PALSAR), both of which are in GEE collections. 
- SAR backscattering depends on **different physical properties of the "target"** compared to the properties that cause reflectance in optical sensors. These properties relate to the structural geometry and (electromagnetic) material properties of what is illuminated by the incident radiation.
- SAR data can be **calibrated**, without the need for atmospheric correction, leading to **consistent time series**

As well as some drawbacks:

- The coherent nature of the SAR microwave radiation causes **speckle** noise. This causes the "salt-and-pepper" appearance of extended target areas (e.g., a large homogeneous agricultural field) that one would expect to have a constant backscattering behavior. Speckle can be reduced in different ways (see next tutorial), but is difficult to eliminate. 
- SAR backscattering depends on the **angle of the incident microwave radiation**. Thus, since the side-looking SAR operates over a range of incidence angles along the swath, the same target will appear different depending on whether it is in near range (low incidence angle) or far range (higher incidence angle) of the swath. The manner in which the backscattering varies with incidence angle depends on the target: a flat dry soil surface has a stronger drop off with incidence angle than, for instance, a forest.
- **Terrain relief** has a strong effect on SAR backscattering because it modulates the area that is illuminated by the side-looking SAR radiation. Slope angle determines the orientation with respect to the incident radiation. This causes foreshortening for slopes oriented towards the SAR and shadowing of slopes steeper than the local incidence and directed away from the SAR.

In order to use SAR data efficiently, you need to be aware of what part of the signal variation relates to the intrinsic properties of the sensor, and what part is linked to the physical properties of the area you are looking at. 

## Sentinel-1

Let's look at some of the issues outlined above and how these relate to practical use of [Sentinel-1](https://sentinel.esa.int/web/sentinel/user-guides/sentinel-1-sar/overview). Sentinel sensor data is generated by the European Union's Copernicus program, which has the operational support of the European Space Agency (ESA). Copernicus Sentinel data is made available under a [full, free and open license](https://sentinel.esa.int/documents/247904/690755/Sentinel_Data_Legal_Notice). This license makes it possible for Google to integrate the data in their catalog of collections and expose it to the many GEE users.

ESA applies SAR processing to generate Level-1 data from raw Sentinel-1 signal data in 2 formats: Single Look Complex (SLC) and Ground Range Detected (GRD). SLC is required for interferometric and partial polarimetric parameter extraction (it contains the phase and amplitude information), whereas GRD is intensity ("detected") data only, sampled in ground range. Google Earth Engine currently ingests GRD data only.

The Level-1 GRD processing assumes an ellipsoid Earth surface model, thus [Level-1 GRD needs to be processed to create the Level-2 geocoded, calibrated backscattering coefficients](https://developers.google.com/earth-engine/sentinel1#sentinel-1-preprocessing) which end up in the GEE COPERNICUS/S1_GRD_FLOAT collection.

The S1_GRD_FLOAT collection, and its log-scaled COPERNICUS/S1_GRD computed equivalent, contains "analysis-ready" images, as they have square pixel spacing, with pixel values as FLOAT32, and a UTM projection in the auto-determined zone. Thus, they can be combined with other images, used in feature extractions and reductions, etc.

### Sentinel-1 coverage

Sentinel-1 consists of two identical sensors ("A" and "B") which have a 12-day revisit orbit each, but a 6-day revisit when combined. However, there are certain limitations to how much data can be acquired and downloaded from the two sensors, which depend on sensor uptime per orbit, ground station visibility for data downlinking and some other factors. The maps in [the observation scenario plan](https://sentinel.esa.int/web/sentinel/missions/sentinel-1/observation-scenario) show actual and planned operations, which provide an initial idea on how certain areas are revisited. 

For a more precise estimate, you can use Earth Engine as follows:

```js
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Comment/uncomment the lists of countries to highlight differences in regional S1 revisit
var aoi = ee.Feature(countries.filter(ee.Filter.inList('country_na',
  ['Germany', 'Poland', 'Czechia', 'Slovakia', 'Austria', 'Hungary'] // European
  // ['Ethiopia', 'Somalia', 'Kenya'] // Near the Equator
  // ['India'] // 12 days revisit, mostly
  )).union().first()).geometry().bounds(); // get bounds to simplify geometry


// Define time period
var startDate = '2020-06-01';
var endDate = '2020-06-16';

// Select S1 IW images in area of interest and time period
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD').
  filterMetadata('instrumentMode', 'equals', 'IW').
  filterBounds(aoi).
  filterDate(startDate, endDate);


var cnt = ee.FeatureCollection(s1).
  // uncomment next line if you want to be specific
  // filterMetadata('orbitProperties_pass', 'equals', 'ASCENDING').
  reduceToImage(['system:index'], ee.Reducer.count());

var upper = cnt.reduceRegion(
  {reducer: ee.Reducer.max(), geometry: aoi, scale: 1000, bestEffort: true}
);

print('Max count:', upper.get('count'));

// Define red to green pseudo color palette
var red2green = ['a50026', 'd73027', 'f46d43', 'fdae61', 'fee08b', 'ffffbf',
  'd9ef8b', 'a6d96a', '66bd63', '1a9850', '006837'];

Map.addLayer(cnt.updateMask(cnt.gt(0)).clip(aoi),
  {min: 1, max: upper.get('count').getInfo(), palette: red2green}, 'All');

Map.centerObject(aoi, 5);
```

You can change the script parameters to find out how S1 coverage varies across different parts of the world.

You will notice that coverages get denser towards the poles, as orbits which are adjacent at the equator start to overlap.

Coverage is most complete over Europe (hey, we pay for this stuff!), where every descending and ascending acquisition
is acquired for both the A and B sensors. For most of India, however, only a single 12-day repeat cycle is possible. The Himalayas, however, are included in the seismic zoning, for which a best effort higher density revisit is programmed.

### Sentinel-1 orbits, modes, swaths and scenes

Sentinel-1 is a **polar orbiting** platform, i.e., after crossing the North Pole, it descends to the South Pole, crosses it and then ascends back to the North Pole. This explains the *orbitProperties_pass* metadata ASCENDING ("ASC") and DESCENDING ("DESC") property that is set on each scene in the S1_GRD_FLOAT collection. The total time needed to go from North to South Pole and back is about 98 minutes (175 orbits in 12 days). In that time, the Earth is turning about 23 degrees to the East, which is why DESC orbits are slightly rotated towards the south-west, and ASC orbits towards the north-west. The *orbitNumber_start* image property contains the absolute orbit sequence number (counted from start of acquisitions). The *relativeOrbitNumber_start* property is often more useful, as it provides the sequence number of the orbit in the 12 day revisit cycle. Scenes with the same *relativeOrbitNumber_start* are exactly 12 days apart (6 days if you combine A and B) and have (almost) the same SAR view configuration.

Sentinel-1 can acquire in different **modes**, by programming the sensor to acquire at different resolution or polarization combinations. The most common mode over land is Interferometric Wide (IW), which is acquired in VV and VH polarization (in some maritime and polar areas in HH and HV). Extended Wide (EW) is used over maritime areas. The main trade-off between the two modes is between resolution and swath width, i.e., the size of the area that is illuminated by the SAR beam in range direction. The IW mode swath is approximately 250 km in size, whereas EW mode can cover a 400 km swath (both modes are actually composed of 3-5 subswaths).

Sentinel-1 is **right-looking**, i.e., the side-looking antenna is sending microwave beams at a 90 degree angle relative to the sensor's flight path (= **azimuth** direction). As stated before, a SAR collects timed range samples of the backscattered signal of a microwave pulse that is sent with a discrete frequency along the azimuth direction. The first backscattered signal is registered for the swath edge that is closest to the sensor orbit, which is called the **near range**. The last backscattered signal sample is registered at the **far range** edge of the swath. From the sensor view configuration (and the next script), it is easy to figure out that near range samples have a lower **incidence angle** than far range samples, and that incidence angle varies regularly (though not linearly) over the swath. Furthermore, DESC orbits have their near to far range angles increasing from roughly east to west (rotated with the orbit angle), whereas for the ASC orbit this is roughly west to east. The combination of different incidence and **look angle** can lead to different backscattering depending on the target. 

The concept of an image is only introduced after Level 1 processing, which re-arranges the Level 0 samples in azimuth and range bins to locations on earth. In order to keep Level 1 images at a reasonable size (e.g., for downloading), the Level 0 data is cut into azimuth time slices of 25 seconds (for IW), which are then processed to GRD. This is where the term **frame** or **scene** is often used. 25 seconds of azimuth time corresponds to approximately 185 km on the ground. 

We now have almost all relevant parameters to understand how Sentinel-1 views an area of interest (AOI). Resolution and pixel spacing are explained in more detail when we deal with speckle. In the next script, we'll highlight some practical aspects of what we just learned.

```js
// The area of interest can also be defined by drawing a shape in the Code Editor map
// We hardcode one here.

var geometry = ee.Geometry.Polygon(
        [[[5.83, 52.74],
          [5.83, 52.69],
          [5.91, 52.69],
          [5.91, 52.74]]], null, false);

// Get Sentinel-1 data for an arbitrary 12 day period
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD').
  filterDate('2020-05-01', '2020-05-13').
  filterMetadata('instrumentMode', 'equals', 'IW').
  filterBounds(geometry);

// Compose an ancillary property to categorize the images in this selection
s1 = s1.map(function(f) {
  return f.set('platform_relorbit',
    ee.String(f.get('platform_number')).cat('_').
    cat(ee.Number(f.get('relativeOrbitNumber_start')).format('%.0f')).
    cat('_').cat(f.get('orbitProperties_pass')));
});

// Check which sensor/relative orbit combinations we have
var orbits = ee.Dictionary(s1.aggregate_histogram('platform_relorbit'));

print(orbits); // Check in console

var keys = orbits.getInfo(); // Needed to loop

for (var k in keys) {
  var color = 'blue';
  if (k.charAt(0)==='B') {
    color = 'green';
  }
  Map.addLayer(ee.Image().paint(ee.FeatureCollection(s1).
    filterMetadata('platform_relorbit', 'equals', k), 0, 1),
    {palette: [color]}, 'Footprint: ' + k, false);
}

for (var k in keys) {
  Map.addLayer(s1.filterMetadata('platform_relorbit', 'equals', k).first(),
    {bands: ['angle'], min: 30, max: 45}, 'Incidence angle: ' + k, false);
}

Map.addLayer(ee.Image().paint(geometry, 0, 1), {palette: ['red']}, 'AOI', false);
Map.centerObject(geometry, 6);
```

If you run the script as is you'll notice that the relatively small AOI is where two DESC orbits overlap (with relative orbit numbers 37 and 110) AND also two ASC orbits (15 and 88). For both Sentinel-1A and 1B combined, that makes for eight distinct coverages in a full orbit cycle of 12 days. By displaying the individual footprints of each of the scenes, you should note that DESC scenes are indeed rotated slightly to the south-west, and ASC scenes to the north-west.

The situation for Sentinel-1B orbit 88 is curious. The scene boundary cuts right through the AOI. This is linked to the 25 seconds azimuth slice limits. Unfortunately, the azimuth slicing is not synchronized between Sentinel-1A and 1B (and may even drift somewhat over time). This means you need to compose the full AOI image cover by compositing two adjacent scenes in this case.

Now switch on the "Incidence Angle" layers. These layers are generated from the "angle" band of each S1_GRD scene. Verify in the "Inspector" tab that incidence angle varies in the range direction between about 30-39 degrees. Since we just learned that the lowest incidence angle is in the near range, we can confirm that Sentinel-1 is a right-looking SAR. 

Finally, inspect some of the VV and VH values for points inside the AOI. Switch to the Google Map satellite mode to select specific land use classes (e.g., urban area, grassland, arable crops). Since we're using the S1_GRD collection, values are expressed in decibels (dB), i.e., on a logarithmic scale. Point samples show significant variation for the different acquisitions. This is expected, because the diversity in orbit look and incidence angles is wide for this AOI, and we have not accounted for speckle effects and neither for the environmental factors (weather, land preparation, crop growth) that influence Sentinel-1 backscatter. The good news is that we have good dynamics in the VV and VH backscattering signal in space and time. The downside is that we now need to control for the various sensor and environmental parameters to start to make sense out of these observations. 

*The upcoming tutorial will deal with resolution, pixel spacing, local incidence angle correction, speckle and speckle filters and, who knows, texture (ETA unknown).*


