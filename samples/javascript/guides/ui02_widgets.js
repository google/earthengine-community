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
 *   from 'Earth Engine User Interface' Widgets section
 */
// [START earthengine__ui02_widgets__label]
var label = ui.Label('Cool label!');
print(label);
// [END earthengine__ui02_widgets__label]

// [START earthengine__ui02_widgets__button]
var button = ui.Button({
  label: 'Get Map Center',
  onClick: function() {
    print(Map.getCenter());
  }
});
print(button);
// [END earthengine__ui02_widgets__button]

// [START earthengine__ui02_widgets__checkbox]
var checkbox = ui.Checkbox('Show SRTM layer', true);

checkbox.onChange(function(checked) {
  // Shows or hides the first map layer based on the checkbox's value.
  Map.layers().get(0).setShown(checked);
});

Map.addLayer(ee.Image('CGIAR/SRTM90_V4'));
print(checkbox);
// [END earthengine__ui02_widgets__checkbox]

// [START earthengine__ui02_widgets__slider]
var slider = ui.Slider();

slider.setValue(0.9);  // Set a default value.
slider.onChange(function(value) {
  Map.layers().get(0).setOpacity(value);
});

Map.addLayer(ee.Image(255), {palette: 'blue'});
print(slider);
// [END earthengine__ui02_widgets__slider]

// [START earthengine__ui02_widgets__textbox]
var textbox = ui.Textbox({
  placeholder: 'Enter text here...',
  onChange: function(text) {
    print('So what you are saying is ' + text + '?');
  }
});
print(textbox);
// [END earthengine__ui02_widgets__textbox]

// [START earthengine__ui02_widgets__select]
var places = {
  MTV: [-122.0849, 37.3887],
  PEK: [116.4056, 39.9097],
  ZRH: [8.536, 47.376]
};

var select = ui.Select({
  items: Object.keys(places),
  onChange: function(key) {
    Map.setCenter(places[key][0], places[key][1]);
  }
});

// Set a place holder.
select.setPlaceholder('Choose a location...');

print(select);
// [END earthengine__ui02_widgets__select]

// [START earthengine__ui02_widgets__map_widget]
// Make a little map.
var map = ui.Map();

// Make the little map display an inset of the big map.
var createInset = function() {
  var bounds = ee.Geometry.Rectangle(Map.getBounds());
  map.centerObject(bounds);
  map.clear();
  map.addLayer(bounds);
};

// Run it once to initialize.
createInset();

// Get a new inset map whenever you click on the big map.
Map.onClick(createInset);

// Display the inset map in the console.
print(map);
// [END earthengine__ui02_widgets__map_widget]

// [START earthengine__ui02_widgets__layers]
var consoleMap = ui.Map({
  lon: -2.0174,
  lat: 48.6474,
  zoom: 13
});

// Create a Layer from this Sentinel-2 image
var image = ee.Image('COPERNICUS/S2/20150821T111616_20160314T094808_T30UWU');
var visParams = {bands: ['B4', 'B3', 'B2'], max: 2048, gamma: 1};
var layer = ui.Map.Layer(image, visParams);

// Update the map by updating the layers list.
var layers = consoleMap.layers();
layers.add(layer);

// Make a textbox to accept a gamma value.
// Update the layer when the gamma value is entered.
var gammaBox = ui.Textbox({
  value: 1,
  onChange: function(value) {
    // visParams is NOT an ActiveDictionary, so set it again.
    visParams.gamma = value;
    layer.setVisParams(visParams);
  }
});

print(ui.Label('Enter a gamma value:'));
print(gammaBox);
print(consoleMap);
// [END earthengine__ui02_widgets__layers]

// [START earthengine__ui02_widgets__style]
var redLabel = ui.Label('Big, Red Label');

redLabel.style().set('color', 'red');
redLabel.style().set('fontWeight', 'bold');
redLabel.style().set({
  fontSize: '32px',
  padding: '10px'
});

print(redLabel);
// [END earthengine__ui02_widgets__style]

// [START earthengine__ui02_widgets__thumbnail]
// Create a box around an area in the Brazilian Amazon.
var box = ee.Geometry.Polygon([[
  [-62.9564, 2.5596], [-62.9550, 2.4313], [-62.8294, 2.4327], [-62.8294, 2.5596]
]]);

// Visualize the image in RGB.
var image = ee.Image('LANDSAT/LE07/C02/T1_L2/LE07_233058_20011113')
                .select(['SR_B[1-3]'])  // blue, green, red reflectance
                .multiply(0.0000275).add(-0.2)  // apply scaling factors
                .visualize({
                  bands: ['SR_B3', 'SR_B2', 'SR_B1'],
                  min: 0,
                  max: 0.12,
                  gamma: 1.3
                });

// Print a thumbnail to the console.
print(ui.Thumbnail({
  image: image,
  params: {dimensions: '256x256', region: box, format: 'png'},
  style: {height: '300px', width: '300px'}
}));
// [END earthengine__ui02_widgets__thumbnail]

// [START earthengine__ui02_widgets__map_linker]
// Add two maps to the screen.
var left = ui.Map();
var right = ui.Map();
ui.root.clear();
ui.root.add(left);
ui.root.add(right);

// Link the "change-bounds" event for the maps.
// When the user drags one map, the other will be moved in sync.
ui.Map.Linker([left, right], 'change-bounds');
// [END earthengine__ui02_widgets__map_linker]

// [START earthengine__ui02_widgets__split_panel]
// Load an image of the Santa Rosa, California 2017 fires.
var image = ee.Image('LANDSAT/LC08/C01/T1_RT_TOA/LC08_045033_20171011');

// Add a color-SWIR composite to the default Map.
Map.addLayer(image, {bands: ['B7', 'B5', 'B3'], max: 0.3}, 'color-SWIR');

// Make another map and add a color-NIR composite to it.
var linkedMap = ui.Map();
linkedMap.addLayer(image, {bands: ['B5', 'B4', 'B3'], max: 0.3}, 'color-NIR');
// Add a thermal image to the map.
linkedMap.addLayer(image, {
  bands: ['B11'],
  min: 290,
  max: 310,
  palette: ['gray', 'white', 'yellow', 'red']
}, 'Thermal');

// Link the default Map to the other map.
var linker = ui.Map.Linker([ui.root.widgets().get(0), linkedMap]);

// Make an inset map and add it to the linked map.
var inset = ui.Map({style: {position: "bottom-right"}});
linkedMap.add(inset);

// Register a function to the linked map to update the inset map.
linkedMap.onChangeBounds(function() {
  var bounds = ee.Geometry.Rectangle(Map.getBounds());
  inset.centerObject(bounds);
  inset.layers().set(0, bounds);
});

// Create a SplitPanel which holds the linked maps side-by-side.
var splitPanel = ui.SplitPanel({
  firstPanel: linker.get(0),
  secondPanel: linker.get(1),
  orientation: 'horizontal',
  wipe: true,
  style: {stretch: 'both'}
});

// Set the SplitPanel as the only thing in root.
ui.root.widgets().reset([splitPanel]);
linkedMap.setCenter(-122.5048, 38.3998, 12);
// [END earthengine__ui02_widgets__split_panel]

// [START earthengine__ui02_widgets__date_slider]
// Use a DateSlider to create annual composites of this collection.
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1');
// Use the start of the collection and now to bound the slider.
var start = ee.Image(collection.first()).date().get('year').format();
var now = Date.now();
var end = ee.Date(now).format();

// Run this function on a change of the dateSlider.
var showMosaic = function(range) {
  var mosaic = ee.Algorithms.Landsat.simpleComposite({
    collection: collection.filterDate(range.start(), range.end())
  });
  // Asynchronously compute the name of the composite.  Display it.
  range.start().get('year').evaluate(function(name) {
    var visParams = {bands: ['B4', 'B3', 'B2'], max: 100};
    var layer = ui.Map.Layer(mosaic, visParams, name + ' composite');
    Map.layers().set(0, layer);
  });
};

// Asynchronously compute the date range and show the slider.
var dateRange = ee.DateRange(start, end).evaluate(function(range) {
  var dateSlider = ui.DateSlider({
    start: range['dates'][0],
    end: range['dates'][1],
    value: null,
    period: 365,
    onChange: showMosaic
  });
  Map.add(dateSlider.setValue(now));
});
// [END earthengine__ui02_widgets__date_slider]

// [START earthengine__ui02_widgets__show_tools]
Map.drawingTools().setShown(false);
// [END earthengine__ui02_widgets__show_tools]

// [START earthengine__ui02_widgets__add_tools]
var map = ui.Map();
// Prints true since drawingTools() adds drawing tools to the map.
print(map.drawingTools().getShown());
// Replace the default Map with the newly created map.
ui.root.widgets().reset([map]);
// [END earthengine__ui02_widgets__add_tools]

// [START earthengine__ui02_widgets__show_geometries]
Map.drawingTools().layers().forEach(function(layer) {
  layer.setShown(false);
});
// [END earthengine__ui02_widgets__show_geometries]

// [START earthengine__ui02_widgets__add_layer]
var geometries = [ee.Geometry.Point([0,0]), ee.Geometry.Rectangle([[0,0], [1,1]])];
Map.drawingTools().addLayer(geometries, 'my_geometry1', 'red');

var layer = ui.Map.GeometryLayer(geometries, 'my_geometry2', 'blue');
Map.drawingTools().layers().add(layer);
// [END earthengine__ui02_widgets__add_layer]

// [START earthengine__ui02_widgets__geometry_events]
// Load elevation data.
var srtm = ee.Image('USGS/SRTMGL1_003');
Map.addLayer(srtm, {min: 0, max: 5000}, 'SRTM');

// Make a label to display mean elevation at drawn points.
var label = new ui.Label('Draw points to calculate mean elevation');
var inspector = new ui.Panel([label]);
Map.add(inspector);
// Don't make imports that correspond to the drawn points.
Map.drawingTools().setLinked(false);
// Limit the draw modes to points.
Map.drawingTools().setDrawModes(['point']);
// Add an empty layer to hold the drawn points.
Map.drawingTools().addLayer([]);
// Set the geometry type to be point.
Map.drawingTools().setShape('point');
// Enter drawing mode.
Map.drawingTools().draw();

// This function gets called when the geometry layer changes.
// Use debounce to call the function at most every 100 milliseconds.
var getAverageElevation = ui.util.debounce(function() {
  var points = Map.drawingTools().layers().get(0).toGeometry();
  var elevation = srtm.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: points,
    scale: 30
  }).get('elevation');
  // Asynchronously evaluate the mean elevation.
  elevation.evaluate(showElevation);
}, 100);

// Set the callback function on changes of the geometry layer.
Map.drawingTools().onEdit(getAverageElevation);
Map.drawingTools().onDraw(getAverageElevation);
Map.drawingTools().onErase(getAverageElevation);

// Set the label to the result of the mean reduction.
function showElevation(elevation) {
  inspector.clear();
  var elevationLabel = ui.Label('Mean elevation: ' + elevation);
  inspector.add(elevationLabel);
}
// [END earthengine__ui02_widgets__geometry_events]
