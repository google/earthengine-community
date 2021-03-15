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

// [START earthengine__apidocs__ee_geometry_polygon]
// Construct a polygon from a list of GeoJSON 'Polygon' formatted coordinates.
var polygonGeoJSON = ee.Geometry.Polygon(
  [
    [ // exterior ring
      [100.0, 0.0],
      [103.0, 0.0],
      [103.0, 3.0],
      [100.0, 3.0],
      [100.0, 0.0]  // matching the first vertex is optional
    ],
    [ // interior ring
      [101.0, 1.0],
      [102.0, 2.0],
      [102.0, 1.0]
    ]
  ]
);
Map.addLayer(polygonGeoJSON, {}, 'polygonGeoJSON');

// Construct a polygon from an ee.Geometry.LinearRing.
var polygonLinearRing = ee.Geometry.Polygon(
  [
    ee.Geometry.LinearRing(
      [
        [105.0, 0.0],
        [108.0, 0.0],
        [108.0, 3.0]
      ]
    )
  ]
);
Map.addLayer(polygonLinearRing, {}, 'polygonLinearRing');

// Construct a polygon from a list of x,y coordinate pairs defining a boundary.
var polygonCoordList = ee.Geometry.Polygon(
  [110.0, 0.0, 113.0, 0.0, 110.0, 3.0]
);
Map.addLayer(polygonCoordList, {}, 'polygonCoordList');

Map.centerObject(polygonLinearRing);
// [END earthengine__apidocs__ee_geometry_polygon]
