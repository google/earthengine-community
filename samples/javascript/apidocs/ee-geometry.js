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

// [START earthengine__apidocs__ee_geometry]
// A GeoJSON object for a triangular polygon.
var geojsonObject = {
  "type": "Polygon",
  "coordinates": [
    [
      [
        -122.085,
        37.423
      ],
      [
        -122.092,
        37.424
      ],
      [
        -122.085,
        37.418
      ],
      [
        -122.085,
        37.423
      ]
    ]
  ]
};
print('ee.Geometry accepts a GeoJSON object', ee.Geometry(geojsonObject));

// GeoJSON strings need to be converted to an object.
var geojsonString = JSON.stringify(geojsonObject);
print('A GeoJSON string needs to be converted to an object',
      ee.Geometry(JSON.parse(geojsonString)));

// Use ee.Geometry to cast computed geometry objects into the ee.Geometry
// class to access their methods. In the following example an ee.Geometry
// object is stored as a ee.Feature property. When it is retrieved with the
// .get() function, a computed geometry object is returned. Cast the computed
// object as a ee.Geometry to get the geometry's bounds, for instance.
var feature = ee.Feature(null, {geom: ee.Geometry(geojsonObject)});
print('Cast computed geometry objects to ee.Geometry class',
      ee.Geometry(feature.get('geom')).bounds());
// [END earthengine__apidocs__ee_geometry]
