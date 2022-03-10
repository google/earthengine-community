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

// [START earthengine__apidocs__ee_imagecollection_aggregate_sample_var]
// A Lansat 8 TOA image collection for a specific year and location.
var col = ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA")
  .filterBounds(ee.Geometry.Point([-122.073, 37.188]))
  .filterDate('2018', '2019');

// An image property of interest, percent cloud cover in this case.
var prop = 'CLOUD_COVER';

// Use ee.ImageCollection.aggregate_* functions to fetch information about
// values of a selected property across all images in the collection. For
// example, produce a list of all values, get counts, and calculate statistics.
print('List of property values', col.aggregate_array(prop));
print('Count of property values', col.aggregate_count(prop));
print('Count of distinct property values', col.aggregate_count_distinct(prop));
print('First collection element property value', col.aggregate_first(prop));
print('Histogram of property values', col.aggregate_histogram(prop));
print('Min of property values', col.aggregate_min(prop));
print('Max of property values', col.aggregate_max(prop));

// The following methods are applicable to numerical properties only.
print('Mean of property values', col.aggregate_mean(prop));
print('Sum of property values', col.aggregate_sum(prop));
print('Product of property values', col.aggregate_product(prop));
print('Std dev (sample) of property values', col.aggregate_sample_sd(prop));
print('Variance (sample) of property values', col.aggregate_sample_var(prop));
print('Std dev (total) of property values', col.aggregate_total_sd(prop));
print('Variance (total) of property values', col.aggregate_total_var(prop));
print('Summary stats of property values', col.aggregate_stats(prop));

// Note that if the property is formatted as a string, min and max will
// respectively return the first and last values according to alphanumeric
// order of the property values.
var propString = 'LANDSAT_SCENE_ID';
print('List of property values (string)', col.aggregate_array(propString));
print('Min of property values (string)', col.aggregate_min(propString));
print('Max of property values (string)', col.aggregate_max(propString));
// [END earthengine__apidocs__ee_imagecollection_aggregate_sample_var]
