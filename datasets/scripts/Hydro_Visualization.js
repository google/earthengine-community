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

//////////////////////////////////////////////////////////////
// Asset List
//////////////////////////////////////////////////////////////

var merit = ee.Image('MERIT/Hydro/v1_0_1');
var elv = merit.select('elv');
var flowDirection = merit.select('dir');
var riverwidth = merit.select('wth');
var waterArea = merit.select('wat');
var upArea = merit.select('upa');
var hand = merit.select('hnd');
var viswidth = merit.select('viswth');

var merit_rd = ee.Image('MERIT/Hydro_reduced/v1_0_1');
var riverwidth_rd = merit_rd.select('wth');
var upArea_rd = merit_rd.select('upa');

var dem = ee.Image('MERIT/DEM/v1_0_3');

//////////////////////////////////////////////////////////////
// Constants
//////////////////////////////////////////////////////////////

// Classify the river width into 17 categories by value.
// CLASS_WTH = ['1','1-20','20-50','50-70','70-100','100-150','150-200','200-300','300-500',
//'500-700','700-1000','1000-1500','1500-2000','2000-3000','3000-5000','5000-7000', '7000-'];

var palette_wth = ['000000', '000080', '0000CD', '4169E1', '0000FF', '1E90FF', '87CEEB',
  '00FFFF', '00FA9A', '7CFC00', 'ADFF2F', 'FFFF00', 'FFA500', 'FF7F50',
  'FF0000', 'B22222', '8B0000'];
var VIS_WTH = {
    min:1,
    max:17,
    palette: palette_wth
};

var palette_elv = ['C9EEE1', 'D6FEF0', 'F9F4E7', 'F9E8CB','F9EDCE', 'F9E3CE', 'F9E9E2', 'FAD9CC', 'F5B7B1', 'f4AAA3'];
var VIS_ELV = {
    min: -0.5,
    max: 10,
    palette: palette_elv
};

var palette_dem = ['000000', '1276DC', '00B5AD', '00C777', '05CD67',
  '3DD872', '21D36D', '71E37D', '55DD77', 'A5ED87', 'E5FA94', 'FEFE98', 'F2EE92', 'DCD286',
  'CABB7C', 'BCA975', 'AE976D', 'A68D69', '8C6C5B', '815E56', '93756E', 'A9918C', 'C9BAB7',
  'E3DBD9', 'FFFFFF'];
var VIS_DEM = {
    min:0,
    max:5200,
    palette: palette_dem
};

// Classify the hand values into 18 categories by value.
// CLASS_HAND = ['0.0-0.1','0.1-0.5','0.5-0.7','0.7-1.0','1.0-2.0','2.0-5.0','5.0-7.0','7.0-10.0','10.0-15.0',
//'15.0-20.0','20.0-30.0','30.0-50.0','50.0-70.0','70.0-100.0','100.0-150.0','150.0-200.0','200.0-300.0','300.0-500.0'];

var palette_hand = ['000000', '1E5BC0', '0882E9', '00A6D7', '00C67B', '31D36D', '69E079',
  'A5EE87', 'E5FC93', 'F3EF92', 'D1C680', 'B29E70', '967860', '88655D', 'A68A85',
  'C2B1AF', 'E1D8D7', 'FFFFFF'];
var VIS_HAND = {
    min:1,
    max:18,
    palette: palette_hand
};

// Define some constants for Interaction Map
var RIVER_WIDTH = 'River Width';
var RIVER_CHANNEL = 'River Channel';
var HAND = 'Hand';  // Height Above the Nearest Drainage
var ELEVATION = 'Elevation';
var UPG = 'Upstream Drainage Pixel';
var UPA = 'Upstream Drainage Area';
var FLOW_DIRECTION = 'Flow Direction';
var TERRAIN = 'Terrain';

//////////////////////////////////////////////////////////////
// Calculations
//////////////////////////////////////////////////////////////

// Hillshade
var hillshade = ee.Terrain.hillshade(elv.multiply(4));

// Terrain for background
var elvBackground = ee.Image(1)
                    .visualize({palette:'000DAF'})
                    .blend(ee.Terrain.slope(elv).visualize(VIS_ELV));

// Tributaries
var tributary = upArea.updateMask(upArea.gt(1));

// Non Centerline Water Body
var waterBody = waterArea.selfMask();

// River Width
// Local and Global
var wth_mask_regional = upArea_rd.gt(50);
var wth_mask_global = upArea_rd.gt(300);
var riverwidthClass = riverwidth_rd
                          .expression(
                              '(b("wth") > 7000) ? 17' +
                              ':(b("wth") > 5000) ? 16' +
                              ':(b("wth") > 3000) ? 15' +
                              ':(b("wth") > 2000) ? 14' +
                              ':(b("wth") > 1500) ? 13' +
                              ':(b("wth") > 1000) ? 12' +
                              ':(b("wth") > 700) ? 11' +
                              ':(b("wth") > 500) ? 10' +
                              ':(b("wth") > 300) ? 9' +
                              ':(b("wth") > 200) ? 8' +
                              ':(b("wth") > 150) ? 7' +
                              ':(b("wth") > 100) ? 6' +
                              ':(b("wth") > 70) ? 5' +
                              ':(b("wth") > 50) ? 4' +
                              ':(b("wth") > 20) ? 3' +
                              ':(b("wth") > 1) ? 2' +
                              ':1');

var rwC_regional = riverwidthClass.updateMask(wth_mask_regional);
var rwC_global = riverwidthClass.updateMask(wth_mask_global);

// Local
var wth_mask_local = viswidth.gt(1);
var viswidthClass = viswidth
                          .expression(
                              '(b("viswth") > 7000) ? 17' +
                              ':(b("viswth") > 5000) ? 16' +
                              ':(b("viswth") > 3000) ? 15' +
                              ':(b("viswth") > 2000) ? 14' +
                              ':(b("viswth") > 1500) ? 13' +
                              ':(b("viswth") > 1000) ? 12' +
                              ':(b("viswth") > 700) ? 11' +
                              ':(b("viswth") > 500) ? 10' +
                              ':(b("viswth") > 300) ? 9' +
                              ':(b("viswth") > 200) ? 8' +
                              ':(b("viswth") > 150) ? 7' +
                              ':(b("viswth") > 100) ? 6' +
                              ':(b("viswth") > 70) ? 5' +
                              ':(b("viswth") > 50) ? 4' +
                              ':(b("viswth") > 20) ? 3' +
                              ':(b("viswth") > 1) ? 2' +
                              ':(b("viswth") == 0) ? 0' +
                              ':1')
                          .selfMask();

var rwC_local = viswidthClass.updateMask(wth_mask_local);

// Hand
var handClass = hand
                    .expression(
                      '(b("hnd") > 300.0) ? 18' +
                      ':(b("hnd") > 200.0) ? 17' +
                      ':(b("hnd") > 150.0) ? 16' +
                      ':(b("hnd") > 100.0) ? 15' +
                      ':(b("hnd") > 70.0) ? 14' +
                      ':(b("hnd") > 50.0) ? 13' +
                      ':(b("hnd") > 30.0) ? 12' +
                      ':(b("hnd") > 20.0) ? 11' +
                      ':(b("hnd") > 15.0) ? 10' +
                      ':(b("hnd") > 10.0) ? 9' +
                      ':(b("hnd") > 7.0) ? 8' +
                      ':(b("hnd") > 5.0) ? 7' +
                      ':(b("hnd") > 2.0) ? 6' +
                      ':(b("hnd") > 1.0) ? 5' +
                      ':(b("hnd") > 0.7) ? 4' +
                      ':(b("hnd") > 0.5) ? 3' +
                      ':(b("hnd") > 0.1) ? 2' +
                      ':1');

//////////////////////////////////////////////////////////////
// Set up the Interactive System on the Map
//////////////////////////////////////////////////////////////

// Set up the overall structure of the app, with a control panel to the left
// of a full-screen map.
ui.root.clear();
var panel = ui.Panel({style: {width: '280px'}});
var map = ui.Map();
ui.root.add(panel).add(map);
map.style().set('cursor', 'crosshair');

// Create title
panel.add(ui.Label(
  'MERIT Hydro Visualization and Interactive Map',
  {fontWeight: 'bold', fontSize:'18px'}
));

// Create a layer selector that dictates which layer is visible on the map.
var select = ui.Select({
  items: [RIVER_WIDTH, RIVER_CHANNEL, TERRAIN],
  value: RIVER_WIDTH,
  onChange: redraw,
});
panel.add(ui.Label('Use the dropdown list below to choose which main layer is shown on the map.')).add(select);

// Add descriptions for three main layers.
panel.add(ui.Label('Main Layer Information:', {fontWeight: 'bold', fontSize:'16px', margin:'12px 0 0 8px'}));

panel.add(ui.Label('River Width', {fontWeight: 'bold', fontSize:'14px', margin:'12px 0 0 8px'}));
panel.add(ui.Label('River channel width at the channel centerlines. '
      +'Select appropriate river width visualization layers from '
      +'"Global", "Regional", "Local" and "Tributaries" depending on the zoom level.',
      {margin:'4px 4px 0 12px'}));

panel.add(ui.Label('River Channel', {fontWeight: 'bold', fontSize:'14px', margin:'12px 0 0 8px'}));
panel.add(ui.Label('River channel network with permanent water body. '
      +'"Major" displays the channels detected by Landsat while '
      +'"Minor" displays the ones not detected.',
      {margin:'4px 4px 0 12px'}));

panel.add(ui.Label('Terrain', {fontWeight: 'bold', fontSize:'14px', margin:'12px 0 0 8px'}));
panel.add(ui.Label('Terrain layer with "Elevation" and "Hand" (Height above the nearest drainage).',
      {margin:'4px 4px 0 12px'}));

// Create the inspector panel, initially hiding it.
var inspector = ui.Panel({style:{shown: false}});
inspector.style().set({width: '270px', position: 'bottom-right'});
map.add(inspector);

// Check-boxes to control which layers are shown in the inspector.
var wthCheck = ui.Checkbox(RIVER_WIDTH).setValue(true);
var elevationCheck = ui.Checkbox(ELEVATION).setValue(true);
var hndCheck = ui.Checkbox(HAND).setValue(true);
var upgCheck = ui.Checkbox(UPG).setValue(true);
var upaCheck = ui.Checkbox(UPA).setValue(true);
var dirCheck = ui.Checkbox(FLOW_DIRECTION).setValue(true);

// Register an onClick handler that populates and shows the inspector panel.
map.onClick(function(coords) {
  // Gather the image bands into a single Image that we can asynchronously sample.

  var point = ee.Geometry.Point(coords.lon, coords.lat);

var lon = ui.Label();
var lat = ui.Label();

  // Add the dot as the second layer, so it shows up on top of the composite.
  var dot = ui.Map.Layer(point, {color: 'FF0000'}, 'clicked location');
  map.layers().set(0, dot);

  var sample = merit.unmask(0).sample(point, 30).first().toDictionary();
  sample.evaluate(function(values) {
    inspector.clear();
    // Display a label that corresponds to a checked checkbox.
    if (wthCheck.getValue()) {
      inspector.add(ui.Label('River Width: ' + Math.round(values.wth) + ' m'));
    }
    if (elevationCheck.getValue()) {
      inspector.add(ui.Label('Elevation: ' + Math.round(values.elv * 100) / 100 + ' m'));
    }
    if (upaCheck.getValue()) {
      inspector.add(ui.Label('Upstream Drainage Area: ' + Math.round(values.upa * 100) / 100 + ' km^2'));
    }
    if (upgCheck.getValue()) {
      inspector.add(ui.Label('Upstream Drain Pixel: ' + values.upg));
    }
    if (hndCheck.getValue()) {
      inspector.add(ui.Label('Hand: ' + Math.round(values.hnd * 100) / 100 + ' m'));
    }
    if (dirCheck.getValue()) {
      inspector.add(ui.Label('Flow Direction: ' + values.dir + ' degrees'));
      inspector.add(ui.Panel([lon, lat], ui.Panel.Layout.flow('horizontal')));

  lon.setValue('lon: ' + coords.lon.toFixed(2));
  lat.setValue('lat: ' + coords.lat.toFixed(2));
    }
    inspector.add(ui.Button('Close', function() {
      inspector.style().set({shown: false});
    }));
    inspector.style().set({shown: true});
  });
});

//////////////////////////////////////////////////////////////
// Map Legend
//////////////////////////////////////////////////////////////

// Create the legend panel.
var legendPanel_wth = ui.Panel({style: {width: '130px', position: 'bottom-left'}});
var legendPanel_dem = ui.Panel({style: {width: '110px'}});
var legendPanel_hand = ui.Panel({style: {width: '80px'}});

// Create the legend title.
var legendTitle_wth = ui.Label({value: 'River Width (m)', style: {fontWeight: 'bold'}});
var legendTitle_dem = ui.Label({value: 'Elevation (m)', style: {fontWeight: 'bold'}});
var legendTitle_hand = ui.Label({value: 'Hand (m)', style: {fontWeight: 'bold'}});

// Function to create the legend image.
function makeLegendImage(VIS) {
  var lon = ee.Image.pixelLonLat().select('latitude');
  var gradient = lon.multiply((VIS.max-VIS.min)/100.0).add(VIS.min);
  var legendImage = gradient.visualize(VIS);
  return legendImage;
}

// Create the color bar for the legend.
var colorBar_wth = ui.Thumbnail({
  image: makeLegendImage(VIS_WTH),
  params: {bbox: [0, 0, 10, 100], dimensions: '30x250'},
  style: {stretch: 'vertical', margin: '13px 13px'},
});
var colorBar_dem = ui.Thumbnail({
  image: makeLegendImage(VIS_DEM),
  params: {bbox: [0, 0, 10, 100], dimensions: '30x250'},
  style: {stretch: 'vertical', margin: '13px 10px'},
});
var colorBar_hand = ui.Thumbnail({
  image: makeLegendImage(VIS_HAND),
  params: {bbox: [0, 0, 10, 100], dimensions: '30x250'},
  style: {stretch: 'vertical', margin: '13px 5.5px'},
});

// Create a panel with three numbers for the legend.
var legendLabels_wth = ui.Panel({
  widgets: [
    ui.Label(7000, {margin: '8px 8px'}),
    ui.Label(3000, {margin: '8px 8px'}),
    ui.Label(1500, {margin: '8px 8px'}),
    ui.Label(700, {margin: '8px 8px'}),
    ui.Label(300, {margin: '8px 8px'}),
    ui.Label(150, {margin: '8px 8px'}),
    ui.Label(70, {margin: '8px 8px'}),
    ui.Label(20, {margin: '8px 8px'}),
    ui.Label(1, {margin: '8px 8px'})
  ],
  layout: ui.Panel.Layout.flow('vertical'),
});

var widgets = [];
for (var i = 0; i < 14; i++) {
  var label = 5200 - 400*i;
  widgets[i] = ui.Label(label, {margin: '3.5px 5px'})
}
var legendLabels_dem = ui.Panel({
  widgets: widgets,
  layout: ui.Panel.Layout.flow('vertical'),
});

var legendLabels_hand = ui.Panel({
  widgets: [
    ui.Label(300.0, {margin: '8px 5px'}),
    ui.Label(150.0, {margin: '8px 5px'}),
    ui.Label(70.0, {margin: '8px 5px'}),
    ui.Label(30.0, {margin: '8px 5px'}),
    ui.Label(15.0, {margin: '8px 5px'}),
    ui.Label(7.0, {margin: '8px 5px'}),
    ui.Label(2.0, {margin: '8px 5px'}),
    ui.Label(0.7, {margin: '8px 5px'}),
    ui.Label(0.2, {margin: '8px 5px'}),
    ui.Label(0, {margin: '8px 5px'})
  ],
  layout: ui.Panel.Layout.flow('vertical'),
});

// Add three properties to the legend panel.
legendPanel_wth.add(ui.Panel(legendTitle_wth));
legendPanel_wth.add(ui.Panel([colorBar_wth, legendLabels_wth], ui.Panel.Layout.flow('horizontal')));

legendPanel_dem.add(ui.Panel(legendTitle_dem));
legendPanel_dem.add(ui.Panel([colorBar_dem, legendLabels_dem], ui.Panel.Layout.flow('horizontal')));

legendPanel_hand.add(ui.Panel(legendTitle_hand));
legendPanel_hand.add(ui.Panel([colorBar_hand, legendLabels_hand], ui.Panel.Layout.flow('horizontal')));

var legendPanel_Terrain = ui.Panel([legendPanel_dem, legendPanel_hand], ui.Panel.Layout.flow('horizontal'), {position: 'bottom-left'});

//////////////////////////////////////////////////////////////
// Map Layers
//////////////////////////////////////////////////////////////

// Create a function to render a map layer configured by the user inputs.
function redraw() {
  map.layers().reset();
  map.remove(legendPanel_wth);
  map.remove(legendPanel_Terrain);

  var layer = select.getValue();

  if (layer == RIVER_CHANNEL) {

    map.addLayer(ee.Image(1), { palette: ['FFFFFF']}, 'clicked location', false, 0)
    map.addLayer(elvBackground, null, 'Background Elevation');
    map.addLayer(tributary, {palette: '000000'}, 'Tributaries');
    map.addLayer(waterBody,{palette: '5F6EFF'}, 'Water Body')
    map.addLayer(viswidth.updateMask(viswidth.gt(0)).lte(30).selfMask(),
      {palette: '000000'}, 'River Channel (Minor)')
    map.addLayer(viswidth.gt(30).selfMask(),
      {palette: '071CEC'}, 'River Channel (Major)');


  } else if (layer == RIVER_WIDTH) {

    map.addLayer(ee.Image(1), { palette: ['FFFFFF']}, 'clicked location', false, 0)
    map.addLayer(hillshade,
    {min: 0, max: 600, palette: ['444444', 'e5e5e5']}, 'Hillshade');
    map.addLayer(waterBody, {palette: '000000'}, 'Water Body');

    // Visualize this layer when zooming-in at zoom level above 8
    map.addLayer(tributary, {palette: '281D2F'}, 'Tributaries', false);

    // Use 'global' at zoom level below 4
    map.addLayer(rwC_local, VIS_WTH, 'River Width (Local)', false);
    map.addLayer(rwC_regional, VIS_WTH, 'River Width (Regional)', true);
    map.addLayer(rwC_global, VIS_WTH, 'River Width (Global)', false);

    map.add(legendPanel_wth);

  } else if (layer == TERRAIN){

    map.addLayer(ee.Image(1), { palette: ['FFFFFF']}, 'clicked location', false, 0);
    map.addLayer(waterBody, {palette: '000000'}, 'Water Body');
    map.addLayer(dem, VIS_DEM, 'Elevation', false);
    map.addLayer(handClass, VIS_HAND, 'Hand', true);

    map.add(legendPanel_Terrain);

  }
}
redraw();
