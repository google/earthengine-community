/**
 * Copyright 2022 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_imagecollection_fromimages]
// A series of images.
var img1 = ee.Image(0);
var img2 = ee.Image(1);
var img3 = ee.Image(2);

// Convert the list of images into an image collection.
var col = ee.ImageCollection.fromImages([img1, img2, img3]);
print('Collection from list of images', col);

// The ee.ImageCollection.fromImages function is intended to coerce the image
// list to a collection when the list is an ambiguous, computed object fetched
// from the properties of a server-side object. For instance, a list
// of images retrieved from a ee.Feature property. Here, we set an image
// list as a property of a feature, retrieve it, and convert it to
// a collection. Notice that the ee.ImageCollection constructor fails to coerce
// the image list to a collection, but ee.ImageCollection.fromImages does.
var feature = ee.Feature(null).set('img_list', [img1, img2, img3]);
var ambiguousImgList = feature.get('img_list');
print('Coerced to collection', ee.ImageCollection.fromImages(ambiguousImgList));
print('NOT coerced to collection', ee.ImageCollection(ambiguousImgList));

// A common use case is coercing an image list from a saveAll join to a
// image collection, like in this example of building a collection of mean
// annual NDVI images from a MODIS collection.
var modisCol = ee.ImageCollection('MODIS/006/MOD13A2')
  .filterDate('2017', '2021')
  .select('NDVI')
  .map(function(img) {return img.set('year', img.date().get('year'))});

var distinctYearCol = modisCol.distinct('year');

var joinedCol = ee.Join.saveAll('img_list').apply({
  primary: distinctYearCol,
  secondary: modisCol,
  condition: ee.Filter.equals({'leftField': 'year', 'rightField': 'year'})
});

var annualNdviMean = joinedCol.map(function(img) {
  return ee.ImageCollection.fromImages(img.get('img_list')).mean()
    .copyProperties(img, ['year']);
});
print('Mean annual NDVI collection', annualNdviMean);
// [END earthengine__apidocs__ee_imagecollection_fromimages]
