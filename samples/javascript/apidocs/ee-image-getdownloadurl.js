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

// [START earthengine__apidocs__ee_image_getdownloadurl]
// A Sentinel-2 surface reflectance image.
var img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG');

// A small region within the image.
var region = ee.Geometry.BBox(-122.0859, 37.0436, -122.0626, 37.0586);

print('Single-band GeoTIFF files wrapped in a zip file',
  img.getDownloadURL({
    name: 'single_band',
    bands: ['B3', 'B8', 'B11'],
    region: region
  }));

print('Multi-band GeoTIFF file wrapped in a zip file',
  img.getDownloadURL({
    name: 'multi_band',
    bands: ['B3', 'B8', 'B11'],
    region: region,
    scale: 20,
    filePerBand: false
  }));

print('Band-specific transformations',
  img.getDownloadURL({
    name: 'custom_single_band',
    bands: [
      {id: 'B3', scale: 10},
      {id: 'B8', scale: 10},
      {id: 'B11', scale: 20}
    ],
    region: region
  }));

print('Multi-band GeoTIFF file',
  img.getDownloadURL({
    bands: ['B3', 'B8', 'B11'],
    region: region,
    scale: 20,
    format: 'GEO_TIFF'
  }));
// [END earthengine__apidocs__ee_image_getdownloadurl]
