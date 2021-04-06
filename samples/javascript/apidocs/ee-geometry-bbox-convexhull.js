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

// [START earthengine__apidocs__ee_geometry_bbox_convexhull]
// Define a BBox object.
var bBox = ee.Geometry.BBox(-122.09, 37.42, -122.08, 37.43);

// Apply the convexHull method to the BBox object.
var bBoxConvexHull = bBox.convexHull({'maxError': 1});

// Print the result to the console.
print('bBox.convexHull(...) =', bBoxConvexHull);

// Display relevant geometries on the map.
Map.setCenter(-122.085, 37.422, 15);
Map.addLayer(bBox,
             {'color': 'black'},
             'Geometry [black]: bBox');
Map.addLayer(bBoxConvexHull,
             {'color': 'red'},
             'Result [red]: bBox.convexHull');
// [END earthengine__apidocs__ee_geometry_bbox_convexhull]