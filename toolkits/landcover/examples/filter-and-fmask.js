/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview
 * Example code snippet to demostrate basic Landcover Toolkit functionality
 * in Code Editor.
 */

// TODO(gino-m): Replace with shared code repo.
var lct = require('users/google/toolkits:landcover/api.js');

// Create a new dataset, filter by date, country, and mask clouds and shadows.
var dataset = lct.Landsat8()
                  .filterDate('2018-06-01', '2019-01-01')
                  .filterBounds(lct.Region.lsib('Tanzania'))
                  .maskCloudsAndShadows();

// Add the resulting ImageCollection to the map, taking the median of
// overlapping pixel values.
Map.addLayer(
    dataset.getImageCollection().median(), dataset.getDefaultVisParams());
Map.setCenter(33.776, -5.944, 5);
