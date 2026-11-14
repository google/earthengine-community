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

// [START earthengine__apidocs__ee_geometry_coveringgrid]
// Define the coordinate reference system (CRS) to be used for grid alignment.
// WGS 84 / UTM zone 36S.
var epsg = 'EPSG:32736';

// Create a point geometry to serve as the center for the analysis.
var point = ee.Geometry.Point(31.6, -8.54);

Map.addLayer(point, {color: 'orange'}, 'Center');
Map.centerObject(point, 8);

// Create a circular buffer of 100,000 meters (100 km) around the point to
// define the study area.
var areaOfInterest = point.buffer(100000);
Map.addLayer(areaOfInterest, {color: 'purple'}, 'Area of interest');

// Calculate a scale value to determine the size of the grid cells.
// Use a power of 2 for best GeoTIFF tiling, e.g., assuming that we'll use the
// grid cell to define image export regions, 2**14 -> 16384.
var scale = Math.pow(2, 14);

// Generate a FeatureCollection of grid cells that covers the buffered area
// using the specified projection and scale.
var grid = areaOfInterest.coveringGrid({proj: epsg, scale: scale});
Map.addLayer(grid, {color: 'blue'}, 'Covering Grid', true, 0.5);

// Define the specific index string of the grid cell to be extracted.
var cellOfInterest = '18,551';
// Filter the grid collection to find the feature matching the index and
// retrieve it as an ee.Feature.
var feature =
    ee.Feature(grid.toList(10000)
                   .filter(ee.Filter.eq('system:index', cellOfInterest))
                   .get(0));
Map.addLayer(feature, {color: 'red'}, 'grid cell', true, 0.5);

// One common use of coveringGrid is to tile operations such as exports.
// This often involves iterating through grid cells on the client-side to
// submit tasks for each cell. Here we print each cell ID using evaluate().
print('Grid cell IDs:');
grid.aggregate_array('system:index').evaluate(function(cellIds) {
  cellIds.forEach(function(cellId) {
    print(cellId);
  });
});
// [END earthengine__apidocs__ee_geometry_coveringgrid]
