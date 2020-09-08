---
title: SAR basics
description: Introduction to SAR basics using Sentinel-1 in GEE.
author: glemoine62
tags: SAR, Sentinel-1, Copernicus, backscattering coefficients, GRD, polarization
date_published: 2020-08-20
---
<!--
Copyright 2019 The Google Earth Engine Community Authors

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

This tutorial introduces the basics for Sentinel-1 use in GEE. It will illustrate basic SAR terminology and demonstrate data selection and visualization.
In a next tutorial, we'll introduce more advanced concepts.

## SAR characteristics

A good introduction into Synthetic Aperture Radar (SAR) basics is [A Tutorial on Synthetic Aperture Radar](https://elib.dlr.de/82313/) by a group of experts at DLR led by Dr. A. Moreira. The essentials are in part I and II. Advanced polarimetry and interferometry, or combined POLINSAR, (part III *ff*) is currently outside the scope of what is possible in GEE.

A key point about SAR is that it is a radar (RAdio Detection And Ranging) instrument, and it's basic measurements are intensity and phase measurements of the backscattered signal, sampled in time bins along the **azimuth** (across track direction of the sensor antenna) and **range** (perpendicular to the direction of the sensor antenna). These time bins relate to locations on Earth from which the backscattered signal originate. The "Synthetic Aperture" of the SAR is the virtual creation of a huge antenna which makes use of the sensor motion and the associated complex data processing, which is necessary to create high resolution in azimuth. By moving along the orbit, the next azimuth line is created from a new microwave pulse in the range direction (this is oversimplified).

The key difference between SAR and optical sensors is that

- SAR is an **active** sensor, transmitting **microwave** radiation, for which it receives the portion **scattered back** to the sensor. Optical sensors are **passive** sensors that register reflected radiation from the Sun (in specific parts of the visible and infrared spectrum).
- SAR is **side-looking**, unlike optical sensors which are, usually, nadir looking. 
- SAR radiation is **coherent**, within a pre-set range of wavelengths. This is useful, because it allows precise **phase** and **intensity** measurements and the use of **polarization**. However, it is also the cause of **speckle**. Optical sensors are not coherent, apart from laser and lidar instruments. 

Reflecting on these differences is important, because it is the basis to understand the relative advantages of SAR compared to optical sensors:

- SAR does not depend on Sun light, thus works **day and night**, provided the sensor acquires data (i.e. is switched on)
- SAR is **insensitive to the atmosphere** in C-band (Sentinel-1, except for very dense rain cells) and L-band (ALOS-PALSAR), both of which are in GEE collections. 
- SAR backscattering (intensity) depends on **different physical properties of the "target"** compared to the properties that cause reflectance in optical sensors. These properties relate to the structural geometry and (electromagnetic) material properties of what is illuminated by the incident radiation.
- SAR data can be **calibrated**, without the need for atmospheric correction, leading to **consistent time series**

as well as the disadvantages:

- The coherent nature of the SAR microwave radiation causes **speckle**. This causes the "salt and pepper" appearance of extended target areas (e.g. a large homogeneous agricultural field) that one would expect to have a constant backscattering behavior. Speckle can be reduced in different ways (see next tutorial), but is difficult to eliminate. 
- SAR backscattering depends on the **angle of the incident microwave radiation**. Thus, since the side-looking SAR operates over a range of incidence angles along the swath, the same target will appear different whether it is in near range (low incidence angle) or far range (higher incidence angle) of the scene. The manner in which the backscattering varies with incidence angle depends on the target: a flat dry soil surface has a stronger drop off with incidence angle than, for instance, a forest.
- **Terrain relief** has a strong effect on SAR backscattering because it modulates the area that is illuminated by the side-looking SAR radiation. Slope angle determines the orientation with respect to the incident radiation. This causes foreshortening for slopes oriented towards the SAR and shadowing of slopes steeper than the local incidence and directed away from the SAR.

In order to use SAR data efficiently, you need to be aware of what part of the signal variation relates to the intrinsic properties of the sensor, and what part is linked to the physical properties of the area you are looking at. 

## Sentinel-1

Let's look at some of the issues outlined above and how these relate to practical use of [Sentinel-1](https://sentinel.esa.int/web/sentinel/user-guides/sentinel-1-sar/overview). Sentinel sensor data is generated by the European Union's Copernicus program, which has the operational support of the European Space Agency (ESA). Copernicus Sentinel data is made available under a [full, free and open license](https://sentinel.esa.int/documents/247904/690755/Sentinel_Data_Legal_Notice). This license makes it possible for Google to integrate the data in their catalog of collections and expose it to the many GEE users.

ESA applies SAR processing to generate Level-1 data from raw Sentinel-1 signal data in 2 formats: Single Look Complex (SLC) and Ground Range Detected (GRD). SLC is required for interferometric and partial polarimetric parameter extraction (it contains the phase information), whereas GRD is intensity ("detected") data only, sampled in ground range. Google collects the GRD data.

The Level-1 GRD processing assumes an elliptoid Earth surface model, thus [Level-1 GRD needs to be processed to create the Level-2 geocoded, calibrated backscattering coefficients](https://developers.google.com/earth-engine/sentinel1#sentinel-1-preprocessing) which end up in the GEE COPERNICUS/S1_GRD_FLOAT collection.

The S1_GRD_FLOAT collection, and its log-scaled S1_GRD computed equivalent, contains "analysis ready" images, as they have square pixel spacing, with pixel values as FLOAT32, and a projection which defaults to the one of the local UTM zone. Thus, they can be combined with other images, used in feature extractions and reductions, etc.

### Sentinel-1 coverage

Sentinel-1 consists of 2 identical A and B sensors, which have a 12 days revisit orbit each, but a 6 days revisit when combined. However, there are certain limitations to how much data can be acquired and downloaded from the 2 sensors, which depend on sensor uptime per orbit, ground station visibility for data downlinking and some other factors. The maps in [the observation scenario plan](https://sentinel.esa.int/web/sentinel/missions/sentinel-1/observation-scenario) show actual and planned operations, which provide an initial idea on how certain areas are revisited. 

For a more precise estimate, you can use GEE as follows:

```
var countries = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017");

// Comment/uncomment the lists of countries to highlight differences in regional S1 revisit
var aoi = ee.Feature(countries.filter(ee.Filter.inList('country_na', 
  ['Germany', 'Poland', 'Czechia', 'Slovakia', 'Austria', 'Hungary']   // European
  //['Ethiopia', 'Somalia', 'Kenya']  // Near the Equator
  // ['India']  // 12 days revisit, mostly
  )).union().first()).geometry().bounds();  // get bounds to simplify geometry

  
// Define time period
var start_date = '2020-06-01';
var end_date = '2020-06-16';

// Select S1 IW images in area of interest and time period
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD').
  filterMetadata('instrumentMode', 'equals', 'IW').
  filterBounds(aoi).
  filterDate(start_date, end_date);
  

var cnt = ee.FeatureCollection(s1).
  // uncomment next line if you want to be specific
  //filterMetadata('orbitProperties_pass', 'equals', 'ASCENDING').  
  reduceToImage(['system:index'], ee.Reducer.count());
  
var upper = cnt.reduceRegion({reducer: ee.Reducer.max(), geometry: aoi, scale: 1000, bestEffort: true});

print("Max count:", upper.get('count'));

// Define red to green pseudo color palette
var red2green = ['a50026','d73027','f46d43','fdae61','fee08b','ffffbf','d9ef8b','a6d96a','66bd63','1a9850','006837'];

Map.addLayer(cnt.updateMask(cnt.gt(0)).clip(aoi), {min:1, max:upper.get('count').getInfo(), palette: red2green}, 'All');
Map.centerObject(aoi,5);

```
You can change the scripts parameters to find out how S1 coverage varies across different parts of the World.
You will notice that coverages get denser towards the poles, as orbits which are adjacent at the Equator start to overlap.
Coverage is most complete over Europe (hey, we pay for this stuff!), where every descending and ascending acquisition 
is acquired for both the A and B sensors. For most of India, however, only a single 12-day repeat cycle is possible, apart
from the Himalayas, which are included in the seismic zoning, for which a best effort higher density revisit is programmed.

### Sentinel-1 orbits, modes, swaths and scenes

Sentinel-1 is a **polar orbiting** platform, i.e. after crossing the North Pole, it descends to the South Pole, crosses it and then ascends back to the North Pole. This explains the *orbitProperties_pass* metadata ASCENDING (ASC) and DESCENDING (DESC) property that is tagged to each scene in the S1_GRD_FLOAT catalog. The total time needed to go from North to South Pole and back is about 98 minutes (175 orbits in 12 days). In that time, the Earth is turning about 23 degrees to the East, which is why DESC orbits are slightly rotated towards the south-west, and ASC orbits towards the north-east. The *orbitNumber_start* metadata tag list the absolute orbit sequence number (counted from start of acquisitions). The *relativeOrbitNumber_start* is often more useful, as it provides the sequence number of the orbit in the 12 day revisit cycle. Scenes from the same *relativeOrbitNumber_start* are exactly 12 days apart (6 days if you combine A and B) and have (almost) the same SAR view configuration. 

Sentinel-1 can acquire in different **modes**, by programming the sensor to acquire at different resolution or polarization combinations. The most common mode over land is Interferometric Wide (IW), which is acquired in VV and VH polarization (in some maritime and polar areas in HH and HV). Extended Wide (EW) is used over maritime areas. The main trade-off between the 2 modes is between resolution and swath width, i.e. the size of the area that is illuminated by the SAR beam in range direction. The IW mode swath is approximately 250 km in size, where EW mode can cover a 400 km swath (both modes are actually composed of 3-5 subswaths).

Sentinel-1 is **right looking**, i.e. the side looking antenna is sending microwave beams at a 90 degree right angle relative to the sensor's flight path (= **azimuth** direction). As stated before, a SAR collects timed range samples of the backscattered signal of a microwave pulse that is sent with a discrete frequency along the azimuth direction. The first backscattered signal is registered for the swath edge that is closest to the sensor orbit, which is called the **near range**. The last backscattered signal sample is registered at the **far range** edge of the swath. From the sensor view configuration, it is easy to figure out that near range samples have a lower **incidence angle** than far range samples, and that incidence angle varies regularly (though not linearly) over the swath. Furthermore, DESC orbits have their near to far range angles increasing from roughly east to west (rotated with the orbit angle), whereas for the ASC orbit this is roughly west to east. The combination of different incidence and **look angle** can lead to different backscattering depending on the target. 

The concept of an image is only introduced after Level 1 processing, which re-arranges the Level 0 samples in azimuth and range bins to locations on earth. In order to keep Level 1 images at a reasonable size (e.g. for downloading), the Level 0 data is cut into azimuth time slices of 25 seconds (for IW), which are then processed to GRD. This is where the term **frame** or **scene** is often used. 25 seconds of azimuth time corresponds to approximately 185 km om the ground. 

We now have (almost) all relevant parameters to understand how Sentinel-1 view an area of interest. Resolution and pixel spacing are explained in more detail when we deal with speckle. In the next script, we'll highlight some practical aspects of what we just learned.





And:


- S1A and S1B scenes not synched

- Incidence angle variation


- Use bulleted lists when items are not strictly ordered.

..and even:

Use     | tables   | to organize | content
------- | -------- | ----------- | -------
Your    | tables   | can         | also
contain | multiple | rows        | ...


