/**
 * Copyright 2022 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_imagecollection_getregion]
// A Landsat 8 TOA image collection (3 months at a specific point, RGB bands).
var col = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterBounds(ee.Geometry.Point(-90.70, 34.71))
  .filterDate('2020-07-01', '2020-10-01')
  .select('B[2-4]');
print('Collection', col);

// Define a region to get pixel values for. This is a small rectangle region
// that intersects 2 image pixels at 30-meter scale.
var roi = ee.Geometry.BBox(-90.496353, 34.851971, -90.495749, 34.852197);

// Display the region of interest overlayed on an image representative. Note
// the ROI intersection with 2 pixels.
var visParams = {
  bands: ['B4', 'B3', 'B2'],
  min: 0.128,
  max: 0.163
};
Map.setCenter(-90.49605, 34.85211, 19);
Map.addLayer(col.first(), visParams, 'Image representative');
Map.addLayer(roi, {color: 'white'}, 'ROI');

// Fetch pixel-level information from all images in the collection for the
// pixels intersecting the ROI.
var pixelInfoBbox = col.getRegion({
  geometry: roi,
  scale: 30
});

// The result is a table (a list of lists) where the first row is column
// labels and subsequent rows are image pixels. Columns contain values for
// the image ID ('system:index'), pixel longitude and latitude, image
// observation time ('system:time_start'), and bands. In this example, note
// that there are 5 images and the region intersects 2 pixels, so n rows
// equals 11 (5 * 2 + 1). All collection images must have the same number of
// bands with the same names.
print('Extracted pixel info', pixelInfoBbox);

// The function accepts all geometry types (e.g., points, lines, polygons).
// Here, a multi-point geometry with two points is used.
var points = ee.Geometry.MultiPoint([[-90.49, 34.85], [-90.48, 34.84]]);
var pixelInfoPoints = col.getRegion({
  geometry: points,
  scale: 30
});
print('Point geometry example', pixelInfoPoints);
// [END earthengine__apidocs__ee_imagecollection_getregion]
