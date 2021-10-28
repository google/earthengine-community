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

// [START earthengine__apidocs__ee_featurecollection]
// FeatureCollection from a string (collection name). Note that this only works
// with client-side strings, it won't accept computed, server-side strings.
var collectionName = 'WRI/GPPD/power_plants';
var collectionNameFc = ee.FeatureCollection(collectionName);
print('FeatureCollection from a string', collectionNameFc.limit(5));

// FeatureCollection from a single geometry.
var singleGeometry = ee.Geometry.Point(-62.54, -27.32);
var singleGeometryFc = ee.FeatureCollection(singleGeometry);
print('FeatureCollection from a single geometry', singleGeometryFc);

// FeatureCollection from a single feature.
var singleFeature = ee.Feature(ee.Geometry.Point(-62.54, -27.32), {key: 'val'});
var singleFeatureFc = ee.FeatureCollection(singleFeature);
print('FeatureCollection from a single feature', singleFeatureFc);

// FeatureCollection from a list of features.
var listOfFeatures = [
  ee.Feature(ee.Geometry.Point(-62.54, -27.32), {key: 'val1'}),
  ee.Feature(ee.Geometry.Point(-69.18, -10.64), {key: 'val2'}),
  ee.Feature(ee.Geometry.Point(-45.98, -18.09), {key: 'val3'})
];
var listOfFeaturesFc = ee.FeatureCollection(listOfFeatures);
print('FeatureCollection from a list of features', listOfFeaturesFc);

// FeatureCollection from GeoJSON.
var geojson = {
  "type": "FeatureCollection",
  "columns": {
    "key": "String",
    "system:index": "String"
  },
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -62.54,
          -27.32
        ]
      },
      "id": "0",
      "properties": {
        "key": "val1"
      }
    }
  ]
};
var geojsonFc = ee.FeatureCollection(geojson);
print('FeatureCollection from GeoJSON', geojsonFc);
// [END earthengine__apidocs__ee_featurecollection]
