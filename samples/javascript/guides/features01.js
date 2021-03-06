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
 *   from 'Geometries' page
 */

// [START earthengine__features01__constructors]
var point = ee.Geometry.Point([1.5, 1.5]);

var lineString = ee.Geometry.LineString(
  [[-35, -10], [35, -10], [35, 10], [-35, 10]]);

var linearRing = ee.Geometry.LinearRing(
  [[-35, -10], [35, -10], [35, 10], [-35, 10], [-35, -10]]);

var rectangle = ee.Geometry.Rectangle([-40, -20, 40, 20]);

var polygon = ee.Geometry.Polygon([
  [[-5, 40], [65, 40], [65, 60], [-5, 60], [-5, 60]]
]);
// [END earthengine__features01__constructors]

// [START earthengine__features01__geometries]
// Create a multi-part feature.
var multiPoint = ee.Geometry.MultiPoint([[-121.68, 39.91], [-97.38, 40.34]]);

// Get the individual geometries as a list.
var geometries = multiPoint.geometries();

// Get each individual geometry from the list and print it.
var pt1 = geometries.get(0);
var pt2 = geometries.get(1);
print('Point 1', pt1);
print('Point 2', pt2);
// [END earthengine__features01__geometries]

// [START earthengine__features01__info]
print('Polygon printout: ', polygon);

// Print polygon area in square kilometers.
print('Polygon area: ', polygon.area().divide(1000 * 1000));

// Print polygon perimeter length in kilometers.
print('Polygon perimeter: ', polygon.perimeter().divide(1000));

// Print the geometry as a GeoJSON string.
print('Polygon GeoJSON: ', polygon.toGeoJSONString());

// Print the GeoJSON 'type'.
print('Geometry type: ', polygon.type());

// Print the coordinates as lists.
print('Polygon coordinates: ', polygon.coordinates());

// Print whether the geometry is geodesic.
print('Geodesic? ', polygon.geodesic());
// [END earthengine__features01__info]

// [START earthengine__features01__planar]
var planarPolygon = ee.Geometry(polygon, null, false);
// [END earthengine__features01__planar]

// [START earthengine__features01__geom_viz]
// Create a geodesic polygon.
var polygon = ee.Geometry.Polygon([
  [[-5, 40], [65, 40], [65, 60], [-5, 60], [-5, 60]]
]);

// Create a planar polygon.
var planarPolygon = ee.Geometry(polygon, null, false);

// Display the polygons by adding them to the map.
Map.centerObject(polygon);
Map.addLayer(polygon, {color: 'FF0000'}, 'geodesic polygon');
Map.addLayer(planarPolygon, {color: '000000'}, 'planar polygon');
// [END earthengine__features01__geom_viz]

// [START earthengine__features01__individual_operations]
// Create a geodesic polygon.
var polygon = ee.Geometry.Polygon([
  [[-5, 40], [65, 40], [65, 60], [-5, 60], [-5, 60]]
]);

// Compute a buffer of the polygon.
var buffer = polygon.buffer(1000000);

// Compute the centroid of the polygon.
var centroid = polygon.centroid();
Map.addLayer(buffer, {}, 'buffer');
Map.addLayer(centroid, {}, 'centroid');
// [END earthengine__features01__individual_operations]

// [START earthengine__features01__insideness_check]
// Create a left-inside polygon.
var holePoly = ee.Geometry.Polygon({
  coords: [
    [[-35, -10], [-35, 10], [35, 10], [35, -10], [-35, -10]]
  ],
  evenOdd: false
});

// Create an even-odd version of the polygon.
var evenOddPoly = ee.Geometry({
  geoJson: holePoly,
  evenOdd: true
});

// Create a point to test the insideness of the polygon.
var pt = ee.Geometry.Point([1.5, 1.5]);

// Check insideness with a contains operator.
print(holePoly.contains(pt));       // false
print(evenOddPoly.contains(pt));    // true
// [END earthengine__features01__insideness_check]

// [START earthengine__features01__venn_diagram]
// Create two circular geometries.
var poly1 = ee.Geometry.Point([-50, 30]).buffer(1e6);
var poly2 = ee.Geometry.Point([-40, 30]).buffer(1e6);

// Display polygon 1 in red and polygon 2 in blue.
Map.setCenter(-45, 30);
Map.addLayer(poly1, {color: 'FF0000'}, 'poly1');
Map.addLayer(poly2, {color: '0000FF'}, 'poly2');

// Compute the intersection, display it in green.
var intersection = poly1.intersection(poly2, ee.ErrorMargin(1));
Map.addLayer(intersection, {color: '00FF00'}, 'intersection');

// Compute the union, display it in magenta.
var union = poly1.union(poly2, ee.ErrorMargin(1));
Map.addLayer(union, {color: 'FF00FF'}, 'union');

// Compute the difference, display in yellow.
var diff1 = poly1.difference(poly2, ee.ErrorMargin(1));
Map.addLayer(diff1, {color: 'FFFF00'}, 'diff1');

// Compute symmetric difference, display in black.
var symDiff = poly1.symmetricDifference(poly2, ee.ErrorMargin(1));
Map.addLayer(symDiff, {color: '000000'}, 'symmetric difference');
// [END earthengine__features01__venn_diagram]
