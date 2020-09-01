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
 *   from 'Reducers - Grouping' section
 */

// [START earthengine__reducers09__grouping_fc]
// Load a collection of US census blocks.
var blocks = ee.FeatureCollection('TIGER/2010/Blocks');

// Compute sums of the specified properties, grouped by state code.
var sums = blocks
  .filter(ee.Filter.and(
    ee.Filter.neq('pop10', null),
    ee.Filter.neq('housing10', null)))
  .reduceColumns({
    selectors: ['pop10', 'housing10', 'statefp10'],
    reducer: ee.Reducer.sum().repeat(2).group({
      groupField: 2,
      groupName: 'state-code',
    })
});

// Print the resultant Dictionary.
print(sums);
// [END earthengine__reducers09__grouping_fc]
