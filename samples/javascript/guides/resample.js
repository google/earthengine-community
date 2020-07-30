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
 *   from Resample and ReduceResolution doc.
 */

// [START earthengine__resample__resample]
// Load a Landsat image over San Francisco, California, UAS.
var landsat = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20160323');

// Set display and visualization parameters.
Map.setCenter(-122.37383, 37.6193, 15);
var visParams = {bands: ['B4', 'B3', 'B2'], max: 0.3};

// Display the Landsat image using the default nearest neighbor resampling.
// when reprojecting to Mercator for the Code Editor map.
Map.addLayer(landsat, visParams, 'original image');

// Force the next reprojection on this image to use bicubic resampling.
var resampled = landsat.resample('bicubic');

// Display the Landsat image using bicubic resampling.
Map.addLayer(resampled, visParams, 'resampled');
// [END earthengine__resample__resample]

// Export the images to the WGS84 crs, using both nearest neighbor
// resampling (default) and bicubic resampling for comparison.
// These are Figures 1a and 1b in the docs.

// Export this region, expressed as a polygon.
var polygon = ee.Geometry.Polygon(
        [[[-122.39233016967773, 37.631464821010745],
          [-122.39245891571045, 37.60631018703994],
          [-122.35263347625732, 37.606344185530936],
          [-122.35246181488037, 37.63136285994676]]]);
// Define a set of export parameters.
var exportParams = {scale: 5, region: polygon};
Export.image(landsat.visualize(visParams), 'resample_original', exportParams);
Export.image(resampled.visualize(visParams), 'resample_bicubic', exportParams);


// [START earthengine__resample__reduce_resolution]
// Load a MODIS EVI image.
var modis = ee.Image(ee.ImageCollection('MODIS/006/MOD13A1').first())
    .select('EVI');

// Display the EVI image near La Honda, California.
Map.setCenter(-122.3616, 37.5331, 12);
Map.addLayer(modis, {min: 2000, max: 5000}, 'MODIS EVI');

// Get information about the MODIS projection.
var modisProjection = modis.projection();
print('MODIS projection:', modisProjection);

// Load and display forest cover data at 30 meters resolution.
var forest = ee.Image('UMD/hansen/global_forest_change_2015')
    .select('treecover2000');
Map.addLayer(forest, {max: 80}, 'forest cover 30 m');

// Get the forest cover data at MODIS scale and projection.
var forestMean = forest
    // Force the next reprojection to aggregate instead of resampling.
    .reduceResolution({
      reducer: ee.Reducer.mean(),
      maxPixels: 1024
    })
    // Request the data at the scale and projection of the MODIS image.
    .reproject({
      crs: modisProjection
    });

// Display the aggregated, reprojected forest cover data.
Map.addLayer(forestMean, {max: 80}, 'forest cover at MODIS scale');
// [END earthengine__resample__reduce_resolution]

// [START earthengine__resample__reduce_resolution_weights]
// Compute forest area per MODIS pixel.
var forestArea = forest.gt(0)
    // Force the next reprojection to aggregate instead of resampling.
    .reduceResolution({
      reducer: ee.Reducer.mean(),
      maxPixels: 1024
    })
    // The reduce resolution returns the fraction of the MODIS pixel
    // that's covered by 30 meter forest pixels.  Convert to area
    // after the reduceResolution() call.
    .multiply(ee.Image.pixelArea())
    // Request the data at the scale and projection of the MODIS image.
    .reproject({
      crs: modisProjection
    });
Map.addLayer(forestArea, {max: 500 * 500}, 'forested area at MODIS scale');
// [END earthengine__resample__reduce_resolution_weights]
