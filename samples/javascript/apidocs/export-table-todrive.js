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

// [START earthengine__apidocs__export_table_todrive]
// A Sentinel-2 surface reflectance image.
var img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG');
Map.setCenter(-122.359, 37.428, 9);
Map.addLayer(img, {bands: ['B11', 'B8', 'B3'], min: 100, max: 3500}, 'img');

// Sample the image at 20 m scale, a point feature collection is returned.
var samp = img.sample({scale: 20, numPixels: 50, geometries: true});
Map.addLayer(samp, {color: 'white'}, 'samp');
print('Image sample feature collection', samp);

// Export the image sample feature collection to Drive as a CSV file.
Export.table.toDrive({
  collection: samp,
  description: 'image_sample_demo_csv',
  folder: 'earth_engine_demos',
  fileFormat: 'CSV'
});

// Export a subset of collection properties: three bands and the geometry
// as GeoJSON.
Export.table.toDrive({
  collection: samp,
  description: 'image_sample_demo_prop_subset',
  folder: 'earth_engine_demos',
  fileFormat: 'CSV',
  selectors: ['B8', 'B11', 'B12', '.geo']
});

// Export the image sample feature collection to Drive as a shapefile.
Export.table.toDrive({
  collection: samp,
  description: 'image_sample_demo_shp',
  folder: 'earth_engine_demos',
  fileFormat: 'SHP'
});
// [END earthengine__apidocs__export_table_todrive]
