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

A good introduction into SAR basics is [A Tutorial on Synthetic Aperture Radar](https://elib.dlr.de/82313/) by a group of experts at DLR led by Dr. A. Moreira. The essentials are in part I and II. Advanced polarimetry and interferometry, or combined POLINSAR, (part III *ff*) is currently outside the scope of what is possible in GEE.

The key difference between SAR and optical sensors is that

- SAR is an **active** sensor, transmitting **microwave** radiation, for which it receives the portion **scattered back** to the sensor. Optical sensors are **passive** sensors that register reflected radiation from the Sun (in specific parts of the visible and infrared spectrum).
- SAR is **side-looking**, unlike optical sensors which are, usually, nadir looking. 
- SAR radiation is **coherent**, within a pre-set range of wavelengths. This is useful, because it allows precise **phase** and **intensity** measurements and the use of **polarization**. However, it is also the cause of **speckle**. Optical sensors are not coherent, apart from laser and lidar instruments. 

Reflecting on these differences is important, because it is the basis to understand the relative advantages of SAR compared to optical sensors:

- SAR does not depend on Sun light, thus works **day and night**, provided the sensor acquires data
- SAR is **insensitive to the atmosphere** in C-band (Sentinel-1, except for very dense rain cells) and L-band (ALOS-PALSAR), both of which are in GEE collections. 
- SAR backscattering (intensity) depends on **different physical properties of the "target"** compared to the properties that cause reflectance in optical sensors. These properties relate to the structural geometry and (electromagnetic) material properties of what is illuminated by the incident radiation.
- SAR data can be **calibrated**, without the need for atmospheric correction, leading to **consistent time series**

as well as the disadvantages:

- The coherent nature of the SAR microwave radiation causes **speckle**. This causes the "salt and pepper" appearance of extended target areas (e.g. a large homogeneous agricultural field) that one would expect to have a constant backscattering behavior. Speckle can be reduced in different ways (see next tutorial), but is difficult to eliminate. 
- SAR backscattering depends on the **angle of the incident microwave radiation**. Thus, since the side-looking SAR operates over a range of incidence angles, the same target will appear different whether it is in near range (low incidence angle) or far range (higher incidence angle) of the scene. The manner in which the backscattering varies with incidence angle depends on the target: a flat dry soil surface has a stronger drop off with incidence angle than, for instance, a forest.
- **Terrain relief** has a strong effect on SAR backscattering because it modulates the area that is illuminated by the side-looking SAR radiation. Slope angle determines the orientation with respect to the incident radiation. This causes foreshortening for slopes oriented towards the SAR and shadowing of slopes steeper than the local incidence and directed away from the SAR.

## Sentinel-1

https://developers.google.com/earth-engine/sentinel1
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
