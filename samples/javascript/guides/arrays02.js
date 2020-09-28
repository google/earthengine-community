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
 *   from 'Arrays - Arrays and Array Images' section
 */

// [START earthengine__arrays02__toy_arrays]
var array1D = ee.Array([1, 2, 3]);              // [1,2,3]
var array2D = ee.Array.cat([array1D], 1);     // [[1],[2],[3]]
// [END earthengine__arrays02__toy_arrays]

print('Arrays:', {
  '1-D array': array1D,
  '2-D array': array2D,
});
