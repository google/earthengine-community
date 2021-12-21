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

// [START earthengine__apidocs__ee_imagecollection_filterbounds]
// A Sentinel-2 surface reflectance image collection for 3 months in 2021.
var ic = ee.ImageCollection('COPERNICUS/S2_SR')
             .filterDate('2021-07-01', '2021-10-01');

// A point geometry for the peak of Mount Shasta, California, USA.
var geom = ee.Geometry.Point(-122.196, 41.411);
print('Images intersecting point geometry', ic.filterBounds(geom));

// A feature collection of point geometries for mountain peaks.
var fc = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point(-122.196, 41.411), {mountain: 'Mount Shasta'}),
  ee.Feature(ee.Geometry.Point(-121.697, 45.374), {mountain: 'Mount Hood'})
]);
print('Images intersecting feature collection', ic.filterBounds(fc));
// [END earthengine__apidocs__ee_imagecollection_filterbounds]
