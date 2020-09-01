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
 *   from 'Feature Collections' page
 */

// [START earthengine__features04__fc_information]
// Load watersheds from a data table.
var sheds = ee.FeatureCollection('USGS/WBD/2017/HUC06')
  // Filter to the continental US.
  .filterBounds(ee.Geometry.Rectangle(-127.18, 19.39, -62.75, 51.29))
  // Convert 'areasqkm' property from string to number.
  .map(function(feature){
    var num = ee.Number.parse(feature.get('areasqkm'));
    return feature.set('areasqkm', num);
  });

// Display the table and print its first element.
Map.addLayer(sheds, {}, 'watersheds');
print('First watershed', sheds.first());

// Print the number of watersheds.
print('Count:', sheds.size());

// Print stats for an area property.
print('Area stats:', sheds.aggregate_stats('areasqkm'));
// [END earthengine__features04__fc_information]




// [START earthengine__features04__fc_column_info]
// Import a protected areas point feature collection.
var wdpa = ee.FeatureCollection("WCMC/WDPA/current/points");

// Define a function to print metadata column names and datatypes. This function
// is intended to be applied by the `evaluate` method which provides the
// function a client-side dictionary allowing the 'columns' object of the
// feature collection metadata to be subset by dot notation or bracket notation
// (`tableMetadata['columns']`).
function getCols(tableMetadata) {
  print(tableMetadata.columns);
}

// Fetch collection metadata (`.limit(0)`) and apply the
// previously defined function using `evaluate()`. The printed object is a
// dictionary where keys are column names and values are datatypes.
wdpa.limit(0).evaluate(getCols);
// [END earthengine__features04__fc_column_info]



// [START earthengine__features04__fc_filtering]
// Load watersheds from a data table.
var sheds = ee.FeatureCollection('USGS/WBD/2017/HUC06')
  // Convert 'areasqkm' property from string to number.
  .map(function(feature){
    var num = ee.Number.parse(feature.get('areasqkm'));
    return feature.set('areasqkm', num);
  });

// Define a region roughly covering the continental US.
var continentalUS = ee.Geometry.Rectangle(-127.18, 19.39, -62.75, 51.29);

// Filter the table geographically: only watersheds in the continental US.
var filtered = sheds.filterBounds(continentalUS);

// Check the number of watersheds after filtering for location.
print('Count after filter:', filtered.size());

// Filter to get only larger continental US watersheds.
var largeSheds = filtered.filter(ee.Filter.gt('areasqkm', 25000));

// Check the number of watersheds after filtering for size and location.
print('Count after filtering by size:', largeSheds.size());
// [END earthengine__features04__fc_filtering]
Map.addLayer(largeSheds, {}, 'large watersheds');

// [START earthengine__features04__add_property]
// Load watersheds from a data table.
var sheds = ee.FeatureCollection('USGS/WBD/2017/HUC06');

// This function computes the feature's geometry area and adds it as a property.
var addArea = function(feature) {
  return feature.set({areaHa: feature.geometry().area().divide(100 * 100)});
};

// Map the area getting function over the FeatureCollection.
var areaAdded = sheds.map(addArea);

// Print the first feature from the collection with the added property.
print('First feature:', areaAdded.first());
// [END earthengine__features04__add_property]

// [START earthengine__features04__centroids]
// This function creates a new feature from the centroid of the geometry.
var getCentroid = function(feature) {
  // Keep this list of properties.
  var keepProperties = ['name', 'huc6', 'tnmid', 'areasqkm'];
  // Get the centroid of the feature's geometry.
  var centroid = feature.geometry().centroid();
  // Return a new Feature, copying properties from the old Feature.
  return ee.Feature(centroid).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var centroids = sheds.map(getCentroid);

// Display the results.
Map.addLayer(centroids, {color: 'FF0000'}, 'centroids');
// [END earthengine__features04__centroids]

// [START earthengine__features04__reduce_column]
// Load watersheds from a data table and filter to the continental US.
var sheds = ee.FeatureCollection('USGS/WBD/2017/HUC06')
  .filterBounds(ee.Geometry.Rectangle(-127.18, 19.39, -62.75, 51.29));

// This function computes the squared difference between an area property
// and area computed directly from the feature's geometry.
var areaDiff = function(feature) {
  // Compute area in sq. km directly from the geometry.
  var area = feature.geometry().area().divide(1000 * 1000);
  // Compute the differece between computed area and the area property.
  var diff = area.subtract(ee.Number.parse(feature.get('areasqkm')));
  // Return the feature with the squared difference set to the 'diff' property.
  return feature.set('diff', diff.pow(2));
};

// Calculate RMSE for population of difference pairs.
var rmse = ee.Number(
  // Map the difference function over the collection.
  sheds.map(areaDiff)
  // Reduce to get the mean squared difference.
  .reduceColumns(ee.Reducer.mean(), ['diff'])
  .get('mean')
)
// Compute the square root of the mean square to get RMSE.
.sqrt();

// Print the result.
print('RMSE=', rmse);
// [END earthengine__features04__reduce_column]

// [START earthengine__features04__reduce_regions]
// Load an image of daily precipitation in mm/day.
var precip = ee.Image(ee.ImageCollection('NASA/ORNL/DAYMET_V3').first());

// Load watersheds from a data table and filter to the continental US.
var sheds = ee.FeatureCollection('USGS/WBD/2017/HUC06')
  .filterBounds(ee.Geometry.Rectangle(-127.18, 19.39, -62.75, 51.29));

// Add the mean of each image as new properties of each feature.
var withPrecip = precip.reduceRegions(sheds, ee.Reducer.mean())
  .filter(ee.Filter.notNull(['prcp']));

// This function computes total rainfall in cubic meters.
var prcpVolume = function(feature) {
  // Precipitation in mm/day -> meters -> sq. meters.
  var volume = ee.Number(feature.get('prcp'))
    .divide(1000).multiply(feature.geometry().area());
  return feature.set('volume', volume);
};

var highVolume = withPrecip
  // Map the function over the collection.
  .map(prcpVolume)
  // Sort descending.
  .sort('volume', false)
  // Get only the 5 highest volume watersheds.
  .limit(5)
  // Extract the names to a list.
  .reduceColumns(ee.Reducer.toList(), ['name']).get('list');

// Print the resulting FeatureCollection.
print(highVolume);

// [END earthengine__features04__reduce_regions]

