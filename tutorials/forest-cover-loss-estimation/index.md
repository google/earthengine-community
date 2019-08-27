---
title: Forest cover and loss estimation
description: Estimate tree area and loss by country based on minimum canopy cover and forest area definition
author: nkeikon
tags: forest, deforestation, mmu, ghg, redd, mrv, frel, frl
date_published: 2019-08-31
---

When estimating forest cover, deforestation, or emissions from land-use change at the national level, countries use forest definitions. In this tutorial, you will learn how to extract forest area by applying technical thresholds of canopy cover and minimum area requirements. 

## Context

FAO defines forests as "Land spanning more than 0.5 hectares with trees higher than 5 meters and a canopy cover of more than 10 percent, or trees able to reach these thresholds in situ. It does not include land that is predominantly under agricultural or urban land use" (FRA 2015). 

In various reporting of forest and/or land-use related data, countries may have different forest definitions, including these parameters, forest types or land use categories. 

## Instructions
### Select a country and set parameters

As an example, this tutorial selected Bolivia, with the minimum canopy cover of 10% and minimum forest area of 0.5 ha (the national definition may be different). 
Depending on the location of the country, the number of pixels that make up for 0.5 ha would differ. You can adjust this by calculating the actual minimum areas you were using (see the last step of the next subsection).

GFC dataset uses 30x30m pixels. Therefore, 6 pixels (>5,000/(30x30)) is used for this exercise. This can be used for countries near the equator. 

### Tree cover

Currently, Google Earth Engine has several tree cover datasets in the catalogue, including the Global Forest Change (year 2000) and GLCF: Landsat Tree Cover Continuous Fields (2000, 2005, and 2010). Here, we use the Global Forest Change dataset.  

1. Select 'treecover2000'
1. Define canopy cover percentage (e.g. greater than equal to 10%)
1. Define minimum area using connectedPixelCount (e.g. greater than equal to 6)
1. Estimate the tree cover that satify the above two
1. Calculate the actual average minimum forest area used (e.g. 6 pixels = 0.51 ha in case of Bolivia)

<img src="treecover.png" width="300">

- Yellow = all trees
- Orange = canopy cover is greater than or equal to 10%
- Green = canopy cover is greter than equal to 10% & min area is greater than or equal to 0.5 ha

### Tree loss

We use the Global Forest Change dataset (year 2001) to demonstrate how to estimate tree loss based on forest definition.

1. Select tree loss that are inside 'forests' (meeting minimum canopy and area requirements)
1. Define minimum area using connectedPixelCount (aka minimum mapping unit, typically the same as the minimum forest area)
1. Estimate the tree loss that satify the above two

<img src="loss.png" width="300">

- Pink = all tree loss
- Brown = tree loss within 'forests' (meeting minimum canopy cover and area requirements)
- Red = tree loss within 'forests' that is greater than or equal to minimum area

<img src="treeloss.png" width="300">
Tree loss over tree cover layer

### Subsequent tree cover

We can estimate the tree cover after the loss by subtracting them (you can also add tree gain if you have data).

1. Use the defined tree cover and tree loss from the previous steps
1. Create a new tree cover where the loss did not occur
1. Apply the minimum area requirement (minimum canopy cover threshold is already applied by using the derived tree cover)
1. Estimate the tree over

## Option: land use categories

You can also exclude certain tree areas such as tree plantations or agricultural plantations with tree crops, if you have spatial data for these areas (e.g. masking, assigning values, etc. - not included in this tutorial). 

## References
- GOFC-GOLD 2013 A sourcebook of methods and procedures for monitoring and reporting anthropogenic greenhouse gas emissions and removals associated with deforestation, gains and losses of carbon stocks in forests remaining forests, and forestation p 126 GOFC-GOLD Report (version COP22-1)
- FAO 2018 From reference levels to results reporting: REDD+ under the UNFCCC 2018 update (Food and Agriculture Organization of the United Nations) (http://fao.org/3/CA0176EN/ca0176en.pdf)
- Forest Resources Assessment Programme (FAO) 2015 Global forest resources assessment 2015 (http://fao.org/3/a-i4808e.pdf)
- Nomura, K., Mitchard, E.T., Bowers, S.J. and Patenaude, G., 2019. Missed carbon emissions from forests: comparing countries' estimates submitted to UNFCCC to biophysical estimates. Environmental Research Letters (https://iopscience.iop.org/article/10.1088/1748-9326/aafc6b)
