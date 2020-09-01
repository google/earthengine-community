/**
 * Copyright 2020 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Earth Engine Developer's Guide examples
 *   from 'Reducers - reduceRegion' section
 */

// [START earthengine__reducers02__reduce_region]
// Load input imagery: Landsat 7 5-year composite.
var image = ee.Image('LANDSAT/LE7_TOA_5YEAR/2008_2012');

// Load an input region: Sierra Nevada.
var region = ee.Feature(ee.FeatureCollection('EPA/Ecoregions/2013/L3')
  .filter(ee.Filter.eq('us_l3name', 'Sierra Nevada'))
  .first());

// Reduce the region. The region parameter is the Feature geometry.
var meanDictionary = image.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: region.geometry(),
  scale: 30,
  maxPixels: 1e9
});

// The result is a Dictionary.  Print it.
print(meanDictionary);
// [END earthengine__reducers02__reduce_region]

// [START earthengine__reducers02__crs_transform]
// As an alternative to specifying scale, specify a CRS and a CRS transform.
// Make this array by constructing a 4326 projection at 30 meters,
// then copying the bounds of the composite, from composite.projection().
var affine = [0.00026949458523585647, 0, -180, 0, -0.00026949458523585647, 86.0000269494563];

// Perform the reduction, print the result.
print(image.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: region.geometry(),
  crs: 'EPSG:4326',
  crsTransform: affine,
  maxPixels: 1e9
}));
// [END earthengine__reducers02__crs_transform]
