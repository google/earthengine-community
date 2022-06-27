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

// [START earthengine__apidocs__ee_featurecollection_aggregate_stats]
// FeatureCollection of power plants in Belgium.
var fc = ee.FeatureCollection('WRI/GPPD/power_plants')
             .filter('country_lg == "Belgium"');

print('Power plant capacities (MW) summary stats',
      fc.aggregate_stats('capacitymw'));

/**
 * Expected ee.Dictionary output
 *
 * {
 *   "max": 2910,
 *   "mean": 201.34242424242427,
 *   "min": 1.8,
 *   "sample_sd": 466.4808892319684,
 *   "sample_var": 217604.42001864797,
 *   "sum": 13288.600000000002,
 *   "sum_sq": 16819846.24,
 *   "total_count": 66,
 *   "total_sd": 462.9334545609107,
 *   "total_var": 214307.38335169878,
 *   "valid_count": 66,
 *   "weight_sum": 66,
 *   "weighted_sum": 13288.600000000002
 * }
 */
// [END earthengine__apidocs__ee_featurecollection_aggregate_stats]
