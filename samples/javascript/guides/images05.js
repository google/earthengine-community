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
 *   from 'Images - Mathematical operations' page
 */

// [START earthengine__images05__ndvi]
// Load a 5-year Landsat 7 composite 1999-2003.
var landsat1999 = ee.Image('LANDSAT/LE7_TOA_5YEAR/1999_2003');

// Compute NDVI.
var ndvi1999 = landsat1999.select('B4').subtract(landsat1999.select('B3'))
  .divide(landsat1999.select('B4').add(landsat1999.select('B3')));
// [END earthengine__images05__ndvi]

// [START earthengine__images05__per_band]
// Load a 5-year Landsat 7 composite 2008-2012.
var landsat2008 = ee.Image('LANDSAT/LE7_TOA_5YEAR/2008_2012');

// Compute multi-band difference between the 2008-2012 composite and the
// previously loaded 1999-2003 composite.
var diff = landsat2008.subtract(landsat1999);
Map.addLayer(diff,
             {bands: ['B4', 'B3', 'B2'], min: -32, max: 32}, 'difference');

// Compute the squared difference in each band.
var squaredDifference = diff.pow(2);
Map.addLayer(squaredDifference,
             {bands: ['B4', 'B3', 'B2'], max: 1000}, 'squared diff.');
// [END earthengine__images05__per_band]
