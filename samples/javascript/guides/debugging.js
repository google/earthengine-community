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
 *   from 'Debugging' page
 */
// [START earthengine__debugging__client_logic]
// Load a Sentinel-2 image.
var image = ee.Image('USGS/SRTMGL1_003');

// Error: "bandNames" is not defined in this scope.
var display = image.visualize({bands: bandNames, min: 0, max: 9000});

// Error: image.selfAnalyze is not a function
var silly = image.selfAnalyze();
// [END earthengine__debugging__client_logic]

// [START earthengine__debugging__cast]
var collection = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Error: collection.first(...).area is not a function
var area = collection.first().area();
// [END earthengine__debugging__cast]

// [START earthengine__debugging__cast_corrected]
var area = ee.Feature(collection.first()).area();
// [END earthengine__debugging__cast_corrected]

// [START earthengine__debugging__tricky]
// Don't mix EE objects and JavaScript objects:
var image = ee.Image('USGS/SRTMGL1_003');
var nonsense = image + 2;

// You can print this, but it's not what you were hoping for.
print(nonsense);

// Error: g.eeObject.name is not a function
Map.addLayer(nonsense);
// [END earthengine__debugging__tricky]

// [START earthengine__debugging__tricky_corrected]
Map.addLayer(image.add(2));
// [END earthengine__debugging__tricky_corrected]

// [START earthengine__debugging__server_error]
// Load a Sentinel-2 image.
var s2image = ee.Image('COPERNICUS/S2/20160625T100617_20160625T170310_T33UVR');

// Error: Image.select: Pattern 'nonBand' did not match any bands.
print(s2image.select(['nonBand']));
// [END earthengine__debugging__server_error]

// [START earthengine__debugging__result_capture]
var s2image = ee.Image('COPERNICUS/S2/20160625T100617_20160625T170310_T33UVR');
s2image.set('myProperty', 'This image is not assigned to a variable');

// This will not result in an error, but will not find 'myProperty'.
print(s2image.get('myProperty')); // null
// [END earthengine__debugging__result_capture]

// [START earthengine__debugging__result_capture_corrected]
s2image = s2image.set('myProperty', 'OK');
print(s2image.get('myProperty')); // OK
// [END earthengine__debugging__result_capture_corrected]

// [START earthengine__debugging__mapped_function1]
var collection = ee.ImageCollection('MODIS/006/MOD44B');

// Error: A mapped function's arguments cannot be used in client-side operations
var badMap3 = collection.map(function(image) {
  print(image);
  return image;
});
// [END earthengine__debugging__mapped_function1]

// [START earthengine__debugging__mapped_function2]
var collection = ee.ImageCollection('MODIS/006/MOD44B');

// Error: User-defined methods must return a value.
var badMap1 = collection.map(function(image) {
  // Do nothing.
});
// [END earthengine__debugging__mapped_function2]

// [START earthengine__debugging__mapped_function3]
var collection = ee.ImageCollection('MODIS/006/MOD44B');

var badMap2 = collection.map(function(image) {
  return image.date();
});

// Error: Collection.map: A mapped algorithm must return a Feature or Image.
print(badMap2);
// [END earthengine__debugging__mapped_function3]

// [START earthengine__debugging__mapped_function4]
var collection = ee.ImageCollection('MODIS/006/MOD44B');

var okMap2 = collection.map(function(image) {
  return image.set('date', image.date());
});
print(okMap2);

// Get a list of the dates.
var datesList = okMap2.aggregate_array('date');
print(datesList);
// [END earthengine__debugging__mapped_function4]

// [START earthengine__debugging__absurd_computation]
var absurdComputation = ee.Image(1).reduceRegion({
  reducer: 'count',
  geometry: ee.Geometry.Rectangle([-180, -90, 180, 90], null, false),
  scale: 100,
});

// Error: Image.reduceRegion: Too many pixels in the region.
//        Found 80300348117, but only 10000000 allowed.
print(absurdComputation);
// [END earthengine__debugging__absurd_computation]

// [START earthengine__debugging__ridiculous_computation]
var ridiculousComputation = ee.Image(1).reduceRegion({
  reducer: 'count',
  geometry: ee.Geometry.Rectangle([-180, -90, 180, 90], null, false),
  scale: 100,
  maxPixels: 1e11
});

// Error: Computation timed out.
print(ridiculousComputation);
// [END earthengine__debugging__ridiculous_computation]

// [START earthengine__debugging__ridiculous_computation_solution]
Export.table.toDrive({
  collection: ee.FeatureCollection([
    ee.Feature(null, ridiculousComputation)
  ]),
  description: 'ridiculousComputation',
  fileFormat: 'CSV'
});
// [END earthengine__debugging__ridiculous_computation_solution]

// [START earthengine__debugging__terrible_aggregations]
var collection = ee.ImageCollection('LANDSAT/LT05/C02/T1')
    .filterBounds(ee.Geometry.Point([-123, 43]));

var terribleAggregations = collection.map(function(image) {
  return image.set(image.reduceRegion({
    reducer: 'mean',
    geometry: image.geometry(),
    scale: 30,
    maxPixels: 1e9
  }));
});

// Error: Quota exceeded: Too many concurrent aggregations.
print(terribleAggregations);
// [END earthengine__debugging__terrible_aggregations]

// [START earthengine__debugging__terrible_aggregations_solution]
Export.table.toDrive({
  collection: terribleAggregations,
  description: 'terribleAggregations',
  fileFormat: 'CSV'
});
// [END earthengine__debugging__terrible_aggregations_solution]

// [START earthengine__debugging__memory_hog]
var memoryHog = ee.ImageCollection('LANDSAT/LT05/C02/T1').select('B.')
  .toArray()
  .arrayReduce(ee.Reducer.mean(), [0])
  .arrayProject([1])
  .arrayFlatten([['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']])
  .reduceRegion({
    reducer: 'mean',
    geometry: ee.Geometry.Point([-122.27, 37.87]).buffer(1000),
    scale: 1,
    bestEffort: true,
  });

// Error: User memory limit exceeded.
print(memoryHog);
// [END earthengine__debugging__memory_hog]

// [START earthengine__debugging__memory_hog_solution1]
var smallerHog = ee.ImageCollection('LANDSAT/LT05/C02/T1').select('B.')
  .toArray()
  .arrayReduce(ee.Reducer.mean(), [0])
  .arrayProject([1])
  .arrayFlatten([['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']])
  .reduceRegion({
    reducer: 'mean',
    geometry: ee.Geometry.Point([-122.27, 37.87]).buffer(1000),
    scale: 1,
    bestEffort: true,
    tileScale: 16
  });

print(smallerHog);
// [END earthengine__debugging__memory_hog_solution1]

// [START earthengine__debugging__memory_hog_solution2]
var okMemory = ee.ImageCollection('LANDSAT/LT05/C02/T1').select('B.')
  .mean()
  .reduceRegion({
    reducer: 'mean',
    geometry: ee.Geometry.Point([-122.27, 37.87]).buffer(1000),
    scale: 1,
    bestEffort: true,
  });

print(okMemory);
// [END earthengine__debugging__memory_hog_solution2]

// [START earthengine__debugging__aside]
var image = ee.Image(ee.ImageCollection('COPERNICUS/S2')
    .filterBounds(ee.Geometry.Point([-12.294402, 168.830071]))
    .aside(print)
    .filterDate('2011-01-01', '2016-12-31')
    .first());
// [END earthengine__debugging__aside]

// [START earthengine__debugging__aside_composite]
var composite = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterBounds(ee.Geometry.Point([106.9155, 47.9177]))
    .map(function(image) {
      return image.addBands(image.normalizedDifference(['B5', 'B4']));
    })
    .aside(Map.addLayer, {bands: ['B4', 'B3', 'B2'], max: 0.3}, 'collection')
    .qualityMosaic('nd');

Map.setCenter(106.9155, 47.9177, 11);
Map.addLayer(composite, {bands: ['B4', 'B3', 'B2'], max: 0.3}, 'composite');
// [END earthengine__debugging__aside_composite]

// [START earthengine__debugging__map_problem]
var image = ee.Image('COPERNICUS/S2/20150821T111616_20160314T094808_T30UWU');

var someFeatures = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-2.0256, 48.4374])),
  ee.Feature(ee.Geometry.Point([-2.8084, 48.3727])),
  ee.Feature(ee.Geometry.Point([-1.2277, 48.2932])),
  ee.Feature(ee.Geometry.Point([-1.7372, 48.6511])),
]);

var problem = someFeatures.map(function(feature) {

  var dictionary = image.reduceRegion({
    reducer: 'first',
    geometry: feature.geometry(),
    scale: 10,
  });

  return feature.set({
    result: ee.Number(dictionary.get('B5'))
                .divide(dictionary.get('B4'))
  });
});

// Error in map(ID=2):
//  Number.divide: Parameter 'left' is required.
print(problem);
// [END earthengine__debugging__map_problem]

// [START earthengine__debugging__refactor]
// Define a function to be mapped over the collection.
var functionToMap = function(feature) {

  var dictionary = image.reduceRegion({
    reducer: 'first',
    geometry: feature.geometry(),
    scale: 10,
  });

  // Debug:
  print(dictionary);

  return feature.set({
    result: ee.Number(dictionary.get('B5'))
                .divide(dictionary.get('B4'))
  });
};

// Isolate the feature that's creating problems.
var badFeature = ee.Feature(someFeatures
    .filter(ee.Filter.eq('system:index', '2'))
    .first());

// Test the function with print statements added.
functionToMap(badFeature);

// Inspect the bad feature in relation to the image.
Map.centerObject(badFeature, 11);
Map.addLayer(badFeature, {}, 'bad feature');
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], max: 3000}, 'image');
// [END earthengine__debugging__refactor]

// [START earthengine__debugging__fixed]
var functionToMap = function(feature) {
  var dictionary = image.reduceRegion({
    reducer: 'first',
    geometry: feature.geometry(),
    scale: 10,
  });
  return feature.set({
    result: ee.Number(dictionary.get('B5'))
                .divide(dictionary.get('B4'))
  });
};

var noProblem = someFeatures
    .filterBounds(image.geometry())
    .map(functionToMap);

print(noProblem);
// [END earthengine__debugging__fixed]
