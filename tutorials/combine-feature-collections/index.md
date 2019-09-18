---
title: Combine FeatureCollections into a new FeatureCollection
description: This basic tutorial shows how users can combine two FeatureCollections into one. It is targeted at beginners.
author: sabrinaszeto
tags: beginner, featurecollection
date_published: 2019-09-18
---

[Open In Code Editor](https://code.earthengine.google.com/b4a2877c24cdd175bca2d7252cd733de)

This basic tutorial shows how users can combine two `ee.FeatureCollection`s into a new `ee.FeatureCollection`.

## Create two `ee.FeatureCollection` objects

Let's begin by generating two sets of random points within the boundary of Utah state in USA. First, define the boundary of Utah as a geometry.

```
var UtahGEOMETRY = ee.Geometry.Polygon([
    [-114.05, 37],
    [-109.05, 37],
    [-109.05, 41],
    [-111.05, 41],
    [-111.05, 42],
    [-114.05, 42]
]);
```

Then, generate two sets of different random points containing 25 points each. We ensure that the points are different by using a different seed, namely 12 and 1, to generate each set.
```
var NewFEATURES = ee.FeatureCollection.randomPoints(UtahGEOMETRY, 25, 12);
var MoreNewFEATURES = ee.FeatureCollection.randomPoints(UtahGEOMETRY, 25, 1);
```

## Combine the `ee.FeatureCollection` objects

Next, create a new `ee.FeatureCollection` using a list of the desired `ee.FeatureCollection`s to combine. Then, flatten them into a single `ee.FeatureCollection`.

```
var combinedFeatureCOLLECTION = ee.FeatureCollection([NewFEATURES,MoreNewFEATURES]).flatten();
```

## Visualize the Results

Let's add all the `ee.FeatureCollection`s to the map. We will also print the results.

```
Map.setCenter(-111.445, 39.251, 6);

Map.addLayer(NewFEATURES, {}, "New Features");
Map.addLayer(MoreNewFEATURES,{color:'red'},"More New Features");
Map.addLayer(combinedFeatureCOLLECTION, {color:'yellow'}, "Combined FeatureCollection");

print(NewFEATURES, MoreNewFEATURES, combinedFeatureCOLLECTION);
```

## Bonus

What happens if you don't flatten the `ee.FeatureCollection`s? Delete `.flatten()` and run the script again to find out. 
