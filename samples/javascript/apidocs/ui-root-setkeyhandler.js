/**
 * Copyright 2026 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ui_root_setkeyhandler]
// Replace the default UI widgets with a few custom widgets.
// Print "Shift A" to the console when Shift+A is pressed.
ui.root.setKeyHandler(
  [ui.Key.SHIFT, ui.Key.A],
  function() {
    print('Shift A');
  },
  'A simple print'
);

// Create a solid black image.
var blackImage = ee.Image(1).visualize({palette: ['black']});

// Create a Layer object so we can easily manipulate its properties.
var blackLayer = ui.Map.Layer(blackImage, {}, 'Black Overlay', true);

// Add the layer to the Map.
Map.layers().add(blackLayer);

// Pressing the "b" key will toggle the layer on and off.
ui.root.setKeyHandler(ui.Key.B, function() {
  // Get the current visibility state.
  var isShown = blackLayer.getShown();

  // Set the visibility to the opposite of the current state.
  blackLayer.setShown(!isShown);

  // Print the status to the console.
  print('Black layer visible: ' + !isShown);
}, 'Toggle black layer');
// [END earthengine__apidocs__ui_root_setkeyhandler]
