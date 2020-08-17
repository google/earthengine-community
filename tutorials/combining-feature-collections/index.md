---
title: Combining FeatureCollections
description: This basic tutorial shows how users can combine two FeatureCollections into one. It is targeted at beginners. The format of this tutorial was based on Prof. Dana Tomlin's Earth Engine notes.
author: sabrinaszeto
tags: beginner, featurecollection
date_published: 2019-10-04
---
<!--
Copyright 2019 The Google Earth Engine Community Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

This basic tutorial shows how users can combine two `ee.FeatureCollection`s into
a new `ee.FeatureCollection`.

## Create two `ee.FeatureCollection` objects

Let's begin by generating two sets of random points within the boundary of Utah
state in the USA. First, define the boundary of Utah as a geometry.

```js
var utahGeometry = ee.Geometry.Polygon([
  [-114.05, 37],
  [-109.05, 37],
  [-109.05, 41],
  [-111.05, 41],
  [-111.05, 42],
  [-114.05, 42]
]);
```

Then, generate two sets of different random points containing 25 points each. We
ensure that the points are different by using a different seed, namely 12 and 1,
to generate each set.

```js
var newFeatures = ee.FeatureCollection.randomPoints(utahGeometry, 25, 12);
var moreNewFeatures = ee.FeatureCollection.randomPoints(utahGeometry, 25, 1);
```

## Combine the `ee.FeatureCollection` objects

Next, create a new `ee.FeatureCollection` by merging `newFeatures` and
`moreNewFeatures`.

```js
var combinedFeatureCollection = newFeatures.merge(moreNewFeatures);
```

## Visualize the Results

Let's add all the `ee.FeatureCollection`s to the map. First, we set the center
of the map to the coordinates defined below and set the zoom level to 6.

```js
Map.setCenter(-111.445, 39.251, 6);
```

Now, we add all the layers, specifying the layer labels as text strings (for
example, `'New Features'`) and colors to display each layer in. We will also
print the results.

```js
Map.addLayer(newFeatures, {}, 'New Features');
Map.addLayer(moreNewFeatures, {color: 'red'}, 'More New Features');
Map.addLayer(combinedFeatureCollection, {color: 'yellow'}, 'Combined FeatureCollection');

print(newFeatures, moreNewFeatures, combinedFeatureCollection);
```

## Bonus Points

- What happens if you change the zoom level in `Map.setCenter` to 3 or to 12?
- Try changing the layer label of `'More New Features'` to `'Red Points'`. Run
the script again to see if it worked.
