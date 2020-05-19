/**
 * Copyright 2020 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Earth Engine Developer's Guide examples
 *   from 'Creating Image Collections' page
 */

// [START earthengine__image_collections02__creating_collections]
// Create arbitrary constant images.
var constant1 = ee.Image(1);
var constant2 = ee.Image(2);

// Create a collection by giving a list to the constructor.
var collectionFromConstructor = ee.ImageCollection([constant1, constant2]);
print('collectionFromConstructor: ', collectionFromConstructor);

// Create a collection with fromImages().
var collectionFromImages = ee.ImageCollection.fromImages(
  [ee.Image(3), ee.Image(4)]);
print('collectionFromImages: ', collectionFromImages);

// Merge two collections.
var mergedCollection = collectionFromConstructor.merge(collectionFromImages);
print('mergedCollection: ', mergedCollection);

// Create a toy FeatureCollection
var features = ee.FeatureCollection(
  [ee.Feature(null, {foo: 1}), ee.Feature(null, {foo: 2})]);

// Create an ImageCollection from the FeatureCollection
// by mapping a function over the FeatureCollection.
var images = features.map(function(feature) {
  return ee.Image(ee.Number(feature.get('foo')));
});

// Print the resultant collection.
print('Image collection: ', images);
// [END earthengine__image_collections02__creating_collections]
