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

// [START earthengine__apidocs__ui_map_setcenter]
// Define a ui.Map widget.
var map = ui.Map();

// Set the position and optional zoom level of the map. Latitude must be
// within [-85, 85].
map.setCenter({lon: -123.6, lat: 47.7, zoom: 9});
print(map);
// [END earthengine__apidocs__ui_map_setcenter]
