/**
 * Copyright 2026 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_join_simple]
// 1. Simple Join by Attribute Match an an ee.FeatureCollection
// This example selects features in one collection that have a matching
// attribute in another collection.
var primaryFeatures = ee.FeatureCollection([
  ee.Feature(null, {id: 1, name: 'Forest'}),
  ee.Feature(null, {id: 2, name: 'Water'}),
  ee.Feature(null, {id: 3, name: 'Urban'}),
  ee.Feature(null, {id: 4, name: 'Shrub'})
]);

var secondaryFeatures = ee.FeatureCollection([
  ee.Feature(null, {type_id: 1, label: 'Natural'}),
  ee.Feature(null, {type_id: 2, label: 'Natural'})
]);

// Define the filter: match 'id' from primary to 'type_id' from secondary.
var filter = ee.Filter.equals({leftField: 'id', rightField: 'type_id'});

// Create the simple join.
var simpleJoin = ee.Join.simple();

// Apply the join. Only 'Forest' and 'Water' (IDs 1 and 2) will remain.
var attributeResult =
    simpleJoin.apply(primaryFeatures, secondaryFeatures, filter);

print('Attribute Join Result:', attributeResult);

// 2. ee.Join.simple on an ee.ImageCollection

// Define a primary collection of Sentinel-2 images.
var primary = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2023-06-01', '2023-07-01')
  .filterBounds(ee.Geometry.Point([-122.3, 37.7]));

// Define a secondary collection representing a specific event or criteria.
// In this case, we filter to images that have a very low cloud cover percentage.
var secondary = primary.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 1));

// Define the join condition. Here we match by the 'system:index' property.
var filter = ee.Filter.equals({
  leftField: 'system:index',
  rightField: 'system:index'
});

// Create the simple join.
var simpleJoin = ee.Join.simple();

// Apply the join to filter the primary collection.
var joinedCollection = simpleJoin.apply(primary, secondary, filter);

print('Original count:', primary.size());
print('Filtered count (only low cloud images):', joinedCollection.size());

// 3. FeatureCollection Spatial Filtering
// Common use case: Keep only the features in a primary collection that
// intersect with a secondary collection of polygon boundaries.
var states = ee.FeatureCollection('TIGER/2018/States');
var region = ee.Geometry.Point([-98.57, 39.82]).buffer(500000).bounds();
var pointsOfInterest = ee.FeatureCollection('WRI/GPPD/power_plants')
  .filterBounds(region);

// Find states that contain at least one power plant within the defined region
var statesWithPlants = ee.Join.simple().apply({
  primary: states,
  secondary: pointsOfInterest,
  condition: ee.Filter.intersects({
    leftField: '.geo',
    rightField: '.geo'
  })
});

Map.centerObject(region, 5);
Map.addLayer(region, {color: 'purple'}, 'Region');
Map.addLayer(states, {color: 'gray'}, 'All States', true, 0.5);
Map.addLayer(statesWithPlants, {color: 'red'}, 'States with Power Plants');
Map.addLayer(pointsOfInterest, {color: 'blue'}, 'Power Plants');
// [END earthengine__apidocs__ee_join_simple]
