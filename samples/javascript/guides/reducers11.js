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
 *   from 'Reducers - unweighted' section
 */

// [START earthengine__reducers11__unweighted]
// Load a Landsat 8 input image.
var image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318');

// Create an arbitrary region.
var geometry = ee.Geometry.Rectangle(-122.496, 37.532, -121.554, 37.538);

// Make an NDWI image.  It will have one band named 'nd'.
var ndwi = image.normalizedDifference(['B3', 'B5']);

// Compute the weighted mean of the NDWI image clipped to the region.
var weighted = ndwi.clip(geometry)
  .reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: geometry,
    scale: 30})
  .get('nd');

// Compute the UN-weighted mean of the NDWI image clipped to the region.
var unweighted = ndwi.clip(geometry)
  .reduceRegion({
    reducer: ee.Reducer.mean().unweighted(),
    geometry: geometry,
    scale: 30})
  .get('nd');

// Observe the difference between weighted and unweighted reductions.
print('weighted:', weighted);
print('unweighted', unweighted);
// [END earthengine__reducers11__unweighted]
