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

// [START earthengine__apidocs__ee_geometry_rectangle]
// Coordinates for the bounds of a rectangle.
var xMin = -122.09;
var yMin = 37.42;
var xMax = -122.08;
var yMax = 37.43;

// Construct a rectangle from a list of GeoJSON 'point' formatted coordinates.
var rectangleGeoJSON = ee.Geometry.Rectangle(
  [
    [xMin, yMin],
    [xMax, yMax]   // max x and y
  ]
);
Map.addLayer(rectangleGeoJSON, {}, 'rectangleGeoJSON');

// Construct a rectangle from a list of ee.Geometry.Point objects.
var rectanglePoint = ee.Geometry.Rectangle(
  [
    ee.Geometry.Point(xMin, yMin),  // min x and y
    ee.Geometry.Point(xMax, yMax)   // max x and y
  ]
);
Map.addLayer(rectanglePoint, {}, 'rectanglePoint');

// Construct a rectangle from a list of bounding coordinates.
var rectangleBounds = ee.Geometry.Rectangle(
  [xMin, yMin, xMax, yMax]
);
Map.addLayer(rectangleBounds, {}, 'rectangleBounds');

Map.setCenter(-122.085, 37.422, 15);
// [END earthengine__apidocs__ee_geometry_rectangle]
