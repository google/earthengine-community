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

// [START earthengine__apidocs__ui_map_setoptions]
// Set the map to terrain with a string.
Map.setOptions('TERRAIN');

// Use a dictionary to add some typo protection.
var mapTypes = {
  HYBRID: 'HYBRID',
  ROADMAP: 'ROADMAP',
  SATELLITE: 'SATELLITE',
  TERRAIN: 'TERRAIN'
};

Map.setOptions({mapTypeId: mapTypes.HYBRID});
Map.setOptions({mapTypeId: mapTypes.ROADMAP});
Map.setOptions({mapTypeId: mapTypes.SATELLITE});
Map.setOptions({mapTypeId: mapTypes.TERRAIN});

// Add a basemap that inverts the lightness to make a darker background.
Map.setOptions({
  styles:
      {'Inverted': [{featureType: 'all', stylers: [{invert_lightness: true}]}]}
});

// Use types keyword to control map type visibility, e.g. show only 'Inverted'.
Map.setOptions({
  styles:
      {'Inverted': [{featureType: 'all', stylers: [{invert_lightness: true}]}]},
  types: ['Inverted']
});
// [END earthengine__apidocs__ui_map_setoptions]
