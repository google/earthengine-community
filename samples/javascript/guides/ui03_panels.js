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
 *   from 'Earth Engine User Interface' Panels and Layouts section
 */

// [START earthengine__ui03_panels__ui_root]
ui.root.clear();
// [END earthengine__ui03_panels__ui_root]

// [START earthengine__ui03_panels__root_map]
// Load a VIIRS surface reflectance image and display on the map.
var image = ee.Image('NOAA/VIIRS/001/VNP09GA/2022_06_05').select('M.*');
Map.addLayer(image, {bands: ['M5', 'M4', 'M3'], min: 0, max: 4e3, gamma: 1.5});

// Create the title label.
var title = ui.Label('Click to inspect');
title.style().set('position', 'top-center');
Map.add(title);

// Create a panel to hold the chart.
var panel = ui.Panel();
panel.style().set({
  width: '400px',
  position: 'bottom-right'
});
Map.add(panel);

// Register a function to draw a chart when a user clicks on the map.
Map.style().set('cursor', 'crosshair');
Map.onClick(function(coords) {
  panel.clear();
  var point = ee.Geometry.Point(coords.lon, coords.lat);
  var chart = ui.Chart.image.regions(image, point, null, 30);
  chart.setOptions({title: 'Band values'});
  panel.add(chart);
});
// [END earthengine__ui03_panels__root_map]

// [START earthengine__ui03_panels__flow_layout]
// Create a panel with vertical flow layout.
var panel = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: {width: '300px'}
});

// Add a bunch of buttons.
for (var i = 0; i < 30; i++) {
  panel.add(ui.Button({label: 'Button ' + i, style: {stretch: 'horizontal'}}));
}

ui.root.clear();
ui.root.add(panel);
// [END earthengine__ui03_panels__flow_layout]

// [START earthengine__ui03_panels__absolute_layout]
ui.root.clear();
ui.root.setLayout(ui.Panel.Layout.absolute());

// A function to make buttons labeled by position.
function makeButton(position) {
  return ui.Button({
    label: position,
    style: {position: position}
  });
}

// Add labeled buttons to the panel.
ui.root.add(makeButton('top-left'));
ui.root.add(makeButton('top-center'));
ui.root.add(makeButton('top-right'));
ui.root.add(makeButton('middle-left'));
ui.root.add(makeButton('middle-right'));
ui.root.add(makeButton('bottom-left'));
ui.root.add(makeButton('bottom-center'));
ui.root.add(makeButton('bottom-right'));
// [END earthengine__ui03_panels__absolute_layout]

// [START earthengine__ui03_panels__panel_widgets]
// Load and display NDVI data.
var ndvi = ee.ImageCollection('NOAA/VIIRS/001/VNP13A1')
    .filterDate('2021-01-01', '2022-01-01').select('NDVI');
Map.addLayer(
  ndvi.median(), {min: 0, max: 10000, palette: ['99c199', '006400']}, 'NDVI');

// Configure the map.
Map.setCenter(-94.84497, 39.01918, 8);
Map.style().set('cursor', 'crosshair');

// Create an empty panel in which to arrange widgets.
// The layout is vertical flow by default.
var panel = ui.Panel({style: {width: '400px'}})
    .add(ui.Label('Click on the map'));

// Set a callback function for when the user clicks the map.
Map.onClick(function(coords) {
  // Create or update the location label (the second widget in the panel)
  var location = 'lon: ' + coords.lon.toFixed(2) + ' ' +
                 'lat: ' + coords.lat.toFixed(2);
  panel.widgets().set(1, ui.Label(location));

  // Add a red dot to the map where the user clicked.
  var point = ee.Geometry.Point(coords.lon, coords.lat);
  Map.layers().set(1, ui.Map.Layer(point, {color: 'FF0000'}));

  // Create a chart of NDVI over time.
  var chart = ui.Chart.image.series(ndvi, point, ee.Reducer.mean(), 200)
      .setOptions({
        title: 'NDVI Over Time',
        vAxis: {title: 'NDVI'},
        lineWidth: 1,
        pointSize: 3,
      });

  // Add (or replace) the third widget in the panel by
  // manipulating the widgets list.
  panel.widgets().set(2, chart);
});

// Add the panel to the ui.root.
ui.root.add(panel);
// [END earthengine__ui03_panels__panel_widgets]
