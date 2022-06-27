/**
 * Copyright 2021 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START earthengine__apidocs__ee_featurecollection_cluster]
// Import a Sentinel-2 surface reflectance image.
var image = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG');

// Get the image geometry to define the geographical bounds of a point sample.
var imageBounds = image.geometry();

// Sample the image at a set of random points; a feature collection is returned.
var pointSampleFc = image.sample(
    {region: imageBounds, scale: 20, numPixels: 1000, geometries: true});

// Instantiate a k-means clusterer and train it.
var clusterer = ee.Clusterer.wekaKMeans(5).train(pointSampleFc);

// Cluster the input using the trained clusterer; optionally specify the name
// of the output cluster ID property.
var clusteredFc = pointSampleFc.cluster(clusterer, 'spectral_cluster');

print('Note added "spectral_cluster" property for an example feature',
      clusteredFc.first().toDictionary());

// Visualize the clusters by applying a unique color to each cluster ID.
var palette = ee.List(['8dd3c7', 'ffffb3', 'bebada', 'fb8072', '80b1d3']);
var clusterVis = clusteredFc.map(function(feature) {
  return feature.set('style', {
    color: palette.get(feature.get('spectral_cluster')),
  });
}).style({styleProperty: 'style'});

// Display the points colored by cluster ID with the S2 image.
Map.setCenter(-122.35, 37.47, 9);
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], min: 0, max: 1500}, 'S2 image');
Map.addLayer(clusterVis, null, 'Clusters');
// [END earthengine__apidocs__ee_featurecollection_cluster]
