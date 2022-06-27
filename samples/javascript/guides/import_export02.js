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
 *   from 'Import and Export data - video' section
 */

// [START earthengine__import_export02__export_video]
// Load a Landsat 5 image collection.
var collection = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA')
  // San Francisco Bay.
  .filter(ee.Filter.eq('WRS_PATH', 44))
  .filter(ee.Filter.eq('WRS_ROW', 34))
  // Filter cloudy scenes.
  .filter(ee.Filter.lt('CLOUD_COVER', 30))
  // Get 20 years of imagery.
  .filterDate('1991-01-01','2011-12-30')
  // Need to have 3-band imagery for the video.
  .select(['B4', 'B3', 'B2'])
  // Need to make the data 8-bit.
  .map(function(image) {
    return image.multiply(512).uint8();
  });

// Define an area to export.
var polygon = ee.Geometry.Rectangle([-122.7286, 37.6325, -122.0241, 37.9592]);

// Export (change dimensions or scale for higher quality).
Export.video.toDrive({
  collection: collection,
  description: 'sfVideoExample',
  dimensions: 720,
  framesPerSecond: 12,
  region: polygon
});
// [END earthengine__import_export02__export_video]

// [START earthengine__import_export02__video_to_cloud]
// Export video to cloud storage.
Export.video.toCloudStorage({
  collection: collection,
  description: 'sfVideoExampleToCloud',
  bucket: 'your-bucket-name',
  dimensions: 720,
  framesPerSecond: 12,
  region: polygon
});
// [END earthengine__import_export02__video_to_cloud]
