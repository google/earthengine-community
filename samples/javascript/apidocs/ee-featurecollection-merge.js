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

// [START earthengine__apidocs__ee_featurecollection_merge]
// FeatureCollection of points representing forest cover.
var fcForest = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-122.248, 37.238]),
             {'id': 0, 'cover_class': 'forest'}),
  ee.Feature(ee.Geometry.Point([-122.204, 37.222]),
             {'id': 1, 'cover_class': 'forest'}),
  ee.Feature(ee.Geometry.Point([-122.110, 37.199]),
             {'id': 2, 'cover_class': 'forest'})
]);

// FeatureCollection of points representing urban cover.
var fcUrban = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-121.953, 37.372]),
             {'id': 0, 'cover_class': 'urban'}),
  ee.Feature(ee.Geometry.Point([-121.861, 37.308]),
             {'id': 1, 'cover_class': 'urban'}),
  ee.Feature(ee.Geometry.Point([-121.984, 37.372]),
             {'id': 2, 'cover_class': 'urban'})
]);

// Merge the two FeatureCollections into one.
var fcMerged = fcForest.merge(fcUrban);

// Display FeatureCollections on the map.
Map.setCenter(-122.034, 37.296, 11);
Map.addLayer(fcForest, {color: 'green'}, 'Forest points');
Map.addLayer(fcUrban, {color: 'grey'}, 'Urban points');
Map.addLayer(fcMerged, {color: 'yellow'}, 'Protected areas merged');
// [END earthengine__apidocs__ee_featurecollection_merge]
