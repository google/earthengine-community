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
 *   from 'Compositing and mosaicking' page
 */

// [START earthengine__image_collections07__mosaic]
// Load four 2012 NAIP quarter quads, different locations.
var naip2012 = ee.ImageCollection('USDA/NAIP/DOQQ')
  .filterBounds(ee.Geometry.Rectangle(-71.17965, 42.35125, -71.08824, 42.40584))
  .filterDate('2012-01-01', '2012-12-31');

// Spatially mosaic the images in the collection and display.
var mosaic = naip2012.mosaic();
Map.setCenter(-71.12532, 42.3712, 12);
Map.addLayer(mosaic, {}, 'spatial mosaic');
// [END earthengine__image_collections07__mosaic]

// [START earthengine__image_collections07__composite]
// Load three NAIP quarter quads in the same location, different times.
var naip2004_2012 = ee.ImageCollection('USDA/NAIP/DOQQ')
  .filterBounds(ee.Geometry.Point(-71.08841, 42.39823))
  .filterDate('2004-07-01', '2012-12-31')
  .select(['R', 'G', 'B']);

// Temporally composite the images with a maximum value function.
var composite = naip2004_2012.max();
Map.setCenter(-71.12532, 42.3712, 12);
Map.addLayer(composite, {}, 'max value composite');
// [END earthengine__image_collections07__composite]
