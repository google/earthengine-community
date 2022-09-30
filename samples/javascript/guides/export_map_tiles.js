/**
 * Copyright 2022 The Google Earth Engine Community Authors
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
 *   from 'Import and Export data' section, 'Exporting Map Tiles' page
 */

// [START earthengine__export_map_tiles__basic]
// --- Example Export Map Tiles - basic ---
// Specify area to clip/export, setup image and preview on map.
var exportRegion = ee.Geometry.BBox(-122.9, 37.1, -121.2, 38.2);
var landsatImage = ee.Image('LANDSAT/LC09/C02/T1_TOA/LC09_044034_20220111')
  .select(['B4', 'B3', 'B2'])
  .visualize({min: 0.02, max: 0.4, gamma: 1.2})
  .clip(exportRegion);
Map.addLayer(landsatImage, {}, 'landsatImage');
Map.centerObject(exportRegion);

// Set up Export task.
Export.map.toCloudStorage({
  image: landsatImage,
  description: 'mapTilesForEE',
  bucket: 'yourBucketName',  // replace with your GCS bucket name
  fileFormat: 'auto',
  maxZoom: 13,
  region: exportRegion,
  writePublicTiles: true
});
// [END earthengine__export_map_tiles__basic]

// [START earthengine__export_map_tiles__for_ee]
// --- Export Map Tiles for use in EE ---
// Use image setup code from example at top of the page.
// Set up Export task.
Export.map.toCloudStorage({
  image: landsatImage,
  description: 'mapTilesForEE',
  bucket: 'yourBucketName',  // replace with your GCS bucket name
  fileFormat: 'auto',
  maxZoom: 13,
  region: exportRegion,
  writePublicTiles: true,
  bucketCorsUris: ['https://code.earthengine.google.com','https://*.earthengine.app']
});
// [END earthengine__export_map_tiles__for_ee]

// [START earthengine__export_map_tiles__for_map_preview]
// --- Export Map Tiles for use with Map Preview ---
// Use image setup code from example at top of the page.
// Set up Export task.
Export.map.toCloudStorage({
  image: landsatImage,
  description: 'mapTilesForMapPreview',
  bucket: 'yourBucketName',  // replace with your GCS bucket name
  fileFormat: 'auto',
  maxZoom: 13,
  region: exportRegion,
  writePublicTiles: true,
  mapsApiKey: 'fakeMapsApiKey012345' // replace with a valid API Key
});
// [END earthengine__export_map_tiles__for_map_preview]

// [START earthengine__export_map_tiles__for_earth_preview]
// --- Export Map Tiles for use with Earth Preview ---
// Use image setup code from example at top of the page.
// Set up Export task.
Export.map.toCloudStorage({
  image: landsatImage,
  description: 'mapTilesForEarthPreview',
  bucket: 'yourBucketName',  // replace with your GCS bucket name
  fileFormat: 'auto',
  maxZoom: 13,
  region: exportRegion,
  writePublicTiles: true,
  bucketCorsUris: []  // leaving blank is ok for Earth Preview only
  // for direct use in Earth, set to: ['https://earth.google.com']
  // or set to public: ['*'] (risk of misuse)
});
// [END earthengine__export_map_tiles__for_earth_preview]

// [START earthengine__export_map_tiles__for_maps_platform]
// --- Export Map Tiles for use with Maps Platform APIs ---
// Use image setup code from example at top of the page.
// Set up Export task.
Export.map.toCloudStorage({
  image: landsatImage,
  description: 'mapTilesForMapsPlatform',
  bucket: 'yourBucketName',  // replace with your GCS bucket name
  fileFormat: 'auto',
  maxZoom: 13,
  region: exportRegion,
  writePublicTiles: true,
  bucketCorsUris: ['*'],  // '*' = All domains = risk of misuse
  // For better protection, specify the domain(s) where the
  // tiles will be used, eg: ['https://mysite.mydomain.com']
  mapsApiKey: 'fakeMapsApiKey012345' // replace with a valid API Key
});
// [END earthengine__export_map_tiles__for_maps_platform]

// [START earthengine__export_map_tiles__for_earth_web]
// --- Export Map Tiles for use with Google Earth web ---
// Use image setup code from example at top of the page.
// Set up Export task.
Export.map.toCloudStorage({
  image: landsatImage,
  description: 'mapTilesForEarthWeb',
  bucket: 'yourBucketName',  // replace with your GCS bucket name
  fileFormat: 'auto',
  maxZoom: 13,
  region: exportRegion,
  writePublicTiles: true,
  bucketCorsUris: ['https://earth.google.com']
  // ['*'] will also work, but risks misuse
});
// [END earthengine__export_map_tiles__for_earth_web]
