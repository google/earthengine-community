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

// [START earthengine__apidocs__ui_map_add]
// The default map in the Code Editor is a built-in ui.Map object called "Map".
// Let's refer to it as "defaultMap" for clarity.
var defaultMap = Map;

// ui.Map objects can be constructed. Here, a new map is declared.
var newMap = ui.Map({
  center: {lat: 0, lon: 0, zoom: 1},
  style: {position: 'bottom-right', width: '400px'}
});

// Add the newMap to the defaultMap;
defaultMap.add(newMap);

// Other UI widgets can be added to ui.Map objects, for example labels:
defaultMap.add(ui.Label('Default Map', {position: 'bottom-left'}));
newMap.add(ui.Label('New Map', {position: 'bottom-left'}));

// ...selectors:
defaultMap.add(ui.Select(['This', 'That', 'Other']));

// ...or buttons:
defaultMap.add(ui.Button('Click me'));

// You can also add ui.Map.Layer objects. Here, an ee.Geometry object
// is converted to a map layer and added to the default map.
var geom = ee.Geometry.Point(-122.0841, 37.4223);
var geomLayer = ui.Map.Layer(geom, {color: 'orange'}, 'Googleplex');
defaultMap.add(geomLayer);
defaultMap.centerObject(geom, 18);
// [END earthengine__apidocs__ui_map_add]
