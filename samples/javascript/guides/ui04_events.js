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
 *   from 'Earth Engine User Interface' Events section
 */

// [START earthengine__ui04_events__events]
// Load some images.
var dem = ee.Image('NASA/NASADEM_HGT/001');
var veg = ee.Image('NOAA/VIIRS/001/VNP13A1/2022_06_02')
  .select(['EVI', 'EVI2', 'NDVI']);

// Make a drop-down menu of bands.
var bandSelect = ui.Select({
  placeholder: 'Select a band...',
  onChange: function(value) {
    var layer = ui.Map.Layer(imageSelect.getValue().select(value));
    // Use set() instead of add() so the previous layer (if any) is overwritten.
    Map.layers().set(0, layer);
  }
});

// Make a drop down menu of images.
var imageSelect = ui.Select({
  items: [
    {label: 'NASADEM', value: dem},
    {label: 'VIIRS Veg', value: veg}
  ],
  placeholder: 'Select an image...',
  onChange: function(value) {
    // Asynchronously get the list of band names.
    value.bandNames().evaluate(function(bands) {
      // Display the bands of the selected image.
      bandSelect.items().reset(bands);
      // Set the first band to the selected band.
      bandSelect.setValue(bandSelect.items().get(0));
    });
  }
});

print(imageSelect);
print(bandSelect);
// [END earthengine__ui04_events__events]

// [START earthengine__ui04_events__unlisten]
// Create a panel, initially hidden.
var panel = ui.Panel({
  style: {
    width: '400px',
    shown: false
  },
  widgets: [
    ui.Label('Click on the map to collapse the settings panel.')
  ]
});

// Create a button to unhide the panel.
var button = ui.Button({
  label: 'Open settings',
  onClick: function() {
    // Hide the button.
    button.style().set('shown', false);
    // Display the panel.
    panel.style().set('shown', true);

    // Temporarily make a map click hide the panel
    // and show the button.
    var listenerId = Map.onClick(function() {
      panel.style().set('shown', false);
      button.style().set('shown', true);
      // Once the panel is hidden, the map should not
      // try to close it by listening for clicks.
      Map.unlisten(listenerId);
    });
  }
});

// Add the button to the map and the panel to root.
Map.add(button);
ui.root.insert(0, panel);
// [END earthengine__ui04_events__unlisten]

// [START earthengine__ui04_events__asynchronous]
// Load and display an NDVI image.
var ndvi = ee.ImageCollection('LANDSAT/LC8_L1T_8DAY_NDVI')
    .filterDate('2014-01-01', '2015-01-01');
var vis = {min: 0, max: 1, palette: ['99c199', '006400']};
Map.addLayer(ndvi.median(), vis, 'NDVI');

// Configure the map.
Map.setCenter(-94.84497, 39.01918, 8);
Map.style().set('cursor', 'crosshair');

// Create a panel and add it to the map.
var inspector = ui.Panel([ui.Label('Click to get mean NDVI')]);
Map.add(inspector);

Map.onClick(function(coords) {
  // Show the loading label.
  inspector.widgets().set(0, ui.Label({
    value: 'Loading...',
    style: {color: 'gray'}
  }));

  // Determine the mean NDVI, a long-running server operation.
  var point = ee.Geometry.Point(coords.lon, coords.lat);
  var meanNdvi = ndvi.reduce('mean');
  var sample = meanNdvi.sample(point, 30);
  var computedValue = sample.first().get('NDVI_mean');

  // Request the value from the server.
  computedValue.evaluate(function(result) {
    // When the server returns the value, show it.
    inspector.widgets().set(0, ui.Label({
      value: 'Mean NDVI: ' + result.toFixed(2),
    }));
  });
});
// [END earthengine__ui04_events__asynchronous]
