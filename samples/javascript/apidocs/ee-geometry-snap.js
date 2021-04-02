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

// [START earthengine__apidocs__geometry_snap]
// Define a Geometry object.
var geometry = ee.Geometry({
  "type": "Polygon",
  "coordinates":
    [[[-122.081, 37.417],
      [-122.086, 37.421],
      [-122.084, 37.418],
      [-122.089, 37.416]]]
});

// Apply the snap method to the Geometry object.
var geometrySnap = geometry.snap({'snapRadius': 500});

// Print the result to the console.
print("geometry.snap({'snapRadius': 500}) = ",
      geometrySnap);

// Display relevant geometries on the map.
Map.setCenter(-122.085, 37.422, 15);
Map.addLayer(geometry,
             {color: 'black'},
             'Geometry [black]: geometry');
Map.addLayer(geometrySnap,
             {color: 'red'},
             'Result [red]: geometry.snap');
// [END earthengine__apidocs__geometry_snap]