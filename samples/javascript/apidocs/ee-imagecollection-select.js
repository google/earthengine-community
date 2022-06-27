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

// [START earthengine__apidocs__ee_imagecollection_select]
// A Sentinel-2 surface reflectance image collection.
var col = ee.ImageCollection('COPERNICUS/S2_SR')
    .filterBounds(ee.Geometry.Point(-122.152, 37.336))
    .filterDate('2021-01-01', '2021-02-01');
print('All band names', col.first().bandNames());

print('Select a band by name',
      col.select('B11').first().bandNames());

print('Select a band by index',
      col.select(10).first().bandNames());

print('Select bands using a list',
      col.select(['B11', 'B8', 'B3']).first().bandNames());

print('Select bands by an argument series',
      col.select('B11', 'B8', 'B3').first().bandNames());

print('Mixing string and integer selectors is valid',
      col.select(10, 'B8', 2).first().bandNames());

print('Rename selected bands using two corresponding lists',
      col.select(['B11', 'B8', 'B3'], ['SWIR1', 'NIR', 'Green'])
      .first().bandNames());

// Use regular expressions to select bands.
print('Match "QA" followed by any two characters',
      col.select('QA..').first().bandNames());

print('Match "B" followed by any character, any number of times',
      col.select('B.*').first().bandNames());

print('Match "B" followed by any character, and any optional third character',
      col.select('B..?').first().bandNames());

print('Match "B" followed by a character in the range 6-8',
      col.select('B[6-8]').first().bandNames());

print('Match "B" followed by a character in the range 1-9 and then 1-2',
      col.select('B[1-9][1-2]').first().bandNames());

print('Match "B" or "QA" each followed by any character, any number of times.',
      col.select('B.*|QA.*').first().bandNames());
// [END earthengine__apidocs__ee_imagecollection_select]
