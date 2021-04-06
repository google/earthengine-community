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

// [START earthengine__apidocs__ee_geometry_multipoint_distance]
// Define a MultiPoint object.
var multiPoint = ee.Geometry.MultiPoint([[-122.082, 37.420], [-122.081, 37.426]]);

// Define other inputs.
var inputGeom = ee.Geometry.Point(-122.090, 37.423);

// Apply the distance method to the MultiPoint object.
var multiPointDistance = multiPoint.distance({'right': inputGeom, 'maxError': 1});

// Print the result to the console.
print('multiPoint.distance(...) =', multiPointDistance);

// Display relevant geometries on the map.
Map.setCenter(-122.085, 37.422, 15);
Map.addLayer(multiPoint,
             {'color': 'black'},
             'Geometry [black]: multiPoint');
Map.addLayer(inputGeom,
             {'color': 'blue'},
             'Parameter [blue]: inputGeom');
// [END earthengine__apidocs__ee_geometry_multipoint_distance]