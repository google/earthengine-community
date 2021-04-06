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

// [START earthengine__apidocs__ee_geometry_polygon_intersects]
// Define a Polygon object.
var polygon = ee.Geometry.Polygon(
    [[[-122.092, 37.424],
      [-122.086, 37.418],
      [-122.079, 37.425],
      [-122.085, 37.423]]]);

// Define other inputs.
var inputGeom = ee.Geometry.BBox(-122.085, 37.415, -122.075, 37.425);

// Apply the intersects method to the Polygon object.
var polygonIntersects = polygon.intersects({'right': inputGeom, 'maxError': 1});

// Print the result to the console.
print('polygon.intersects(...) =', polygonIntersects);

// Display relevant geometries on the map.
Map.setCenter(-122.085, 37.422, 15);
Map.addLayer(polygon,
             {'color': 'black'},
             'Geometry [black]: polygon');
Map.addLayer(inputGeom,
             {'color': 'blue'},
             'Parameter [blue]: inputGeom');
// [END earthengine__apidocs__ee_geometry_polygon_intersects]