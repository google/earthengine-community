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

// [START earthengine__apidocs__ui_map_getzoom]
// The default map in the Code Editor is a built-in ui.Map object called "Map".
// Let's refer to it as "defaultMap" for clarity.
var defaultMap = Map;

// ui.Map objects can be constructed. Here, a new map is declared.
var newMap = ui.Map({
  center: {lat: 0, lon: 0, zoom: 1},
  style: {position: 'bottom-right', width: '400px'}
});

// Add the newMap to the defaultMap.
defaultMap.add(newMap);

// You can set the viewport of a ui.Map to be centered on an object.
// Here, the defaultMap is centered on a point with a selected zoom level.
var geom = ee.Geometry.Point(-122.0841, 37.4223);
defaultMap.centerObject(geom, 18);
defaultMap.addLayer(geom, {color: 'orange'}, 'Googleplex');

// Map extent can be fetched using the ui.Map.getBounds method.
print('defaultMap bounds as a list',
      defaultMap.getBounds());
print('defaultMap bounds as a dictionary',
      ee.Dictionary.fromLists(['w', 's', 'e', 'n'], defaultMap.getBounds()));
print('defaultMap bounds as GeoJSON',
      defaultMap.getBounds(true));

// Map center point can be fetched using the ui.Map.getCenter method.
print('defaultMap center as a Point geometry', defaultMap.getCenter());

// Map zoom level can be fetched using the ui.Map.getZoom method.
print('defaultMap zoom level', defaultMap.getZoom());

// Map scale can be fetched using the ui.Map.getScale method.
print('defaultMap approximate pixel scale', defaultMap.getScale());
// [END earthengine__apidocs__ui_map_getzoom]
