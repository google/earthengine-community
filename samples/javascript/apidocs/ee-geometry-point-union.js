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

// [START earthengine__apidocs__ee_geometry_point_union]
// Define a Point object.
var point = ee.Geometry.Point(-122.082, 37.42);

// Define other inputs.
var inputGeom = ee.Geometry.BBox(-122.085, 37.415, -122.075, 37.425);

// Apply the union method to the Point object.
var pointUnion = point.union({'right': inputGeom, 'maxError': 1});

// Print the result to the console.
print('point.union(...) =', pointUnion);

// Display relevant geometries on the map.
Map.setCenter(-122.085, 37.422, 15);
Map.addLayer(point,
             {'color': 'black'},
             'Geometry [black]: point');
Map.addLayer(inputGeom,
             {'color': 'blue'},
             'Parameter [blue]: inputGeom');
Map.addLayer(pointUnion,
             {'color': 'red'},
             'Result [red]: point.union');
// [END earthengine__apidocs__ee_geometry_point_union]