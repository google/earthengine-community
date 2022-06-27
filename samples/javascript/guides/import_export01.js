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
 *   from 'Import and Export data' section
 */

// [START earthengine__import_export01__export_setup]
// Load a landsat image and select three bands.
var landsat = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_123032_20140515')
  .select(['B4', 'B3', 'B2']);

// Create a geometry representing an export region.
var geometry = ee.Geometry.Rectangle([116.2621, 39.8412, 116.4849, 40.01236]);
// [END earthengine__import_export01__export_setup]

// [START earthengine__import_export01__export_projection]
// Retrieve the projection information from a band of the original image.
// Call getInfo() on the projection to request a client-side object containing
// the crs and transform information needed for the client-side Export function.
var projection = landsat.select('B2').projection().getInfo();
// [END earthengine__import_export01__export_projection]

// [START earthengine__import_export01__export_image]
// Export the image, specifying the CRS, transform, and region.
Export.image.toDrive({
  image: landsat,
  description: 'imageToDriveExample_transform',
  crs: projection.crs,
  crsTransform: projection.transform,
  region: geometry
});
// [END earthengine__import_export01__export_image]

// [START earthengine__import_export01__export_cogeo]
// Export a cloud-optimized GeoTIFF.
Export.image.toDrive({
  image: landsat,
  description: 'imageToCOGeoTiffExample',
  crs: projection.crs,
  crsTransform: projection.transform,
  region: geometry,
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  }
});
// [END earthengine__import_export01__export_cogeo]

// [START earthengine__import_export01__image_to_cloud]
// Export the image to Cloud Storage.
Export.image.toCloudStorage({
  image: landsat,
  description: 'imageToCloudExample',
  bucket: 'your-bucket-name',
  fileNamePrefix: 'exampleExport',
  crs: projection.crs,
  crsTransform: projection.transform,
  region: geometry
});
// [END earthengine__import_export01__image_to_cloud]

// [START earthengine__import_export01__image_to_asset]
// Get band 4 from the Landsat image, copy it.
var band4 = landsat.select('B4').rename('b4_mean')
  .addBands(landsat.select('B4').rename('b4_sample'))
  .addBands(landsat.select('B4').rename('b4_max'));

// Export the image to an Earth Engine asset.
Export.image.toAsset({
  image: band4,
  description: 'imageToAssetExample',
  assetId: 'exampleExport',
  crs: projection.crs,
  crsTransform: projection.transform,
  region: geometry,
  pyramidingPolicy: {
    'b4_mean': 'mean',
    'b4_sample': 'sample',
    'b4_max': 'max'
  }
});
// [END earthengine__import_export01__image_to_asset]

Map.addLayer(landsat, {bands: ['B4', 'B3', 'B2'], max: 0.4, gamma: 1.2});

// [START earthengine__import_export01__export_vectors]
// Make a collection of points.
var features = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point(30.41, 59.933), {name: 'Voronoi'}),
  ee.Feature(ee.Geometry.Point(-73.96, 40.781), {name: 'Thiessen'}),
  ee.Feature(ee.Geometry.Point(6.4806, 50.8012), {name: 'Dirichlet'})
]);

// Export the FeatureCollection to a KML file.
Export.table.toDrive({
  collection: features,
  description:'vectorsToDriveExample',
  fileFormat: 'KML'
});
// [END earthengine__import_export01__export_vectors]

// [START earthengine__import_export01__vectors_to_cloud]
// Export a KML file to Cloud Storage.
Export.table.toCloudStorage({
  collection: features,
  description:'vectorsToCloudStorageExample',
  bucket: 'your-bucket-name',
  fileNamePrefix: 'exampleTableExport',
  fileFormat: 'KML'
});
// [END earthengine__import_export01__vectors_to_cloud]

// [START earthengine__import_export01__export_table_asset]
// Export an ee.FeatureCollection as an Earth Engine asset.
Export.table.toAsset({
  collection: features,
  description:'exportToTableAssetExample',
  assetId: 'exampleAssetId',
});
// [END earthengine__import_export01__export_table_asset]


// [START earthengine__import_export01__export_table]
// Load a Landsat TOA image.
var image = ee.Image('LANDSAT/LC08/T1_TOA/LC08_044034_20140318');

// Create an arbitrary rectangle.
var region = ee.Geometry.Rectangle(-122.2806, 37.1209, -122.0554, 37.2413);

// Get a dictionary of means in the region.
var means = image.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: region,
  crs: projection.crs,
  crsTransform: projection.transform,
});

// Make a feature without geometry and set the properties to the dictionary of means.
var feature = ee.Feature(null, means);

// Wrap the Feature in a FeatureCollection for export.
var featureCollection = ee.FeatureCollection([feature]);

// Export the FeatureCollection.
Export.table.toDrive({
  collection: featureCollection,
  description: 'exportTableExample',
  fileFormat: 'CSV'
});
// [END earthengine__import_export01__export_table]

// [START earthengine__import_export01__export_map]
// Load the global Accessibility to Cities image.
var accessibility = ee.Image('Oxford/MAP/accessibility_to_cities_2015_v1_0');

// Color palette for visualizing accessibility data.
var accessibilityPalette = ['f2fef8', 'defce1', 'c9f3bc', 'cbeca7', 'd6e793',
  'e2d87b', 'd4a561', 'c46c49', 'ab3a38', '922f4b', '7d285d', '672069',
  '3a1453', '1b0c3c', '050526', '00030f', '000000'];

// Apply the color palette to the log of travel time.
var accessibilityVis = {min: 0, max: 10, palette: accessibilityPalette};
var logAccessibility =
    accessibility.where(accessibility.gt(0), accessibility.log());
var accessibilityRgb = logAccessibility.visualize(accessibilityVis);

// Composite onto a solid-color background to fill in the oceans.
var background = ee.Image(0).visualize({palette: ['11101e']});
var accessibilityBlended = background.blend(accessibilityRgb).updateMask(1);

// Check the visualization.
Map.addLayer(accessibilityBlended, {}, 'accessibilityBlended');

// Define an export region.
var exportRegion = ee.Geometry.Rectangle([34, -3, 40, 1]);
Map.centerObject(exportRegion);
Map.addLayer(exportRegion, {}, 'exportRegion');

// Export the visualization image as map tiles.
Export.map.toCloudStorage({
  // All tiles that intersect the region get exported in their entirety.
  // Clip the image to prevent low resolution tiles from appearing outside
  // of the region.
  image: accessibilityBlended.clip(exportRegion),
  description: 'mapToCloudExample',
  bucket: 'your-bucket-name',
  maxZoom: 13,
  region: exportRegion
});
// [END earthengine__import_export01__export_map]
