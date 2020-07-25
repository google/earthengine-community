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
 *   from 'Reducing' section
 */

// [START earthengine__gettingStarted10__spatial_reduce]
// Load and display a Landsat TOA image.
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], max: 0.3});

// Create an arbitrary rectangle as a region and display it.
var region = ee.Geometry.Rectangle(-122.2806, 37.1209, -122.0554, 37.2413);
Map.addLayer(region);

// Get a dictionary of means in the region.  Keys are bandnames.
var mean = image.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: region,
  scale: 30
});
// [END earthengine__gettingStarted10__spatial_reduce]

print('mean: ', mean);
