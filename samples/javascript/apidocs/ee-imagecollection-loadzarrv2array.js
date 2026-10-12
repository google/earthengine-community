/**
 * Copyright 2026 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_imagecollection_loadzarrv2array]
var timeStart = 1000000;
var timeEnd = 1000048;
var evaporation = ee.ImageCollection.loadZarrV2Array({
  uri: 'gs://gcp-public-data-arco-era5/ar/' +
      'full_37-1h-0p25deg-chunk-1.zarr-v3/evaporation/.zarray',
  proj: 'EPSG:4326',
  axis: 0,
  starts: [timeStart],
  ends: [timeEnd]
});

print(evaporation);

Map.addLayer(evaporation, {min: -0.0001, max: 0.00005}, 'Evaporation');

// Load a 2m temperature Zarr v2 array.
var temperature = ee.ImageCollection.loadZarrV2Array({
  uri: 'gs://gcp-public-data-arco-era5/ar/' +
      'full_37-1h-0p25deg-chunk-1.zarr-v3/2m_temperature/.zarray',
  proj: 'EPSG:4326',
  axis: 0,
  starts: [timeStart],
  ends: [timeEnd]
});

print(temperature);

var visParams = {
  min: 220,
  max: 350,
  palette: [
    'darkblue', 'blue', 'cyan', 'green', 'yellow', 'orange', 'red', 'darkred'
  ]
};
Map.addLayer(temperature, visParams, '2m Temperature');
// [END earthengine__apidocs__ee_imagecollection_loadzarrv2array]
