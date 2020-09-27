//////////////////////////////////////////////////////////////
// Asset List
//////////////////////////////////////////////////////////////

var merit = ee.Image('users/meritdataset/Merit-Hydro-world');
var elv = merit.select('elv');
var flowDirection = merit.select('dir');
var riverwidth = merit.select('wth');
var waterArea = merit.select('wat');
var upArea = merit.select('upa');
var hand = merit.select('hnd');
var viswidth = merit.select('viswth');

var merit_rd = ee.Image('users/meritdataset/Merit-Hydro-world_reduced');
var riverwidth_rd = merit_rd.select('wth');
var upArea_rd = merit_rd.select('upa');

var dem = ee.Image('users/meritdataset/Merit-DEM-world');

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

var palette_elv = ['C9EEE1', 'D6FEF0', 'F9F4E7', 'F9EDCE', 'F9E3CE', 'F9E9E2', 'FAD9CC', 'F5B7B1'];
var VIS_ELV = {
    min: 0, 
    max: 10, 
    palette: palette_elv
};

var palette_dem = ['000000', '2353B9', '1276DC', '0098FE', '00B5AD', '05CD67', '3DD872',
  '71E37D', 'A5ED87', 'E5FA94', 'F2EE92', 'DCD286', 'BCA975', 'A68D69',
  '8C6C5B', '93756E', 'A9918C', 'C9BAB7', 'E3DBD9', 'FFFFFF'];
var VIS_DEM = {
    min:0,
    max:5700,
    palette: palette_dem
};

// Classify the hand values into 18 categories by value.
// CLASS_HND = ['0.0-0.1','0.1-0.5','0.5-0.7','0.7-1.0','1.0-2.0','2.0-5.0','5.0-7.0','7.0-10.0','10.0-15.0',
//'15.0-20.0','20.0-30.0','30.0-50.0','50.0-70.0','70.0-100.0','100.0-150.0','150.0-200.0','200.0-300.0','300.0-500.0'];

var palette_hnd = ['000000', '1E5BC0', '0882E9', '00A6D7', '00C67B', '31D36D', '69E079',
  'A5EE87', 'E5FC93', 'F3EF92', 'D1C680', 'B29E70', '967860', '88655D', 'A68A85',
  'C2B1AF', 'E1D8D7', 'FFFFFF'];
var VIS_HND = {
    min:1,
    max:18,
    palette: palette_hnd
};

// Define some constants for Interaction Map
var RIVERWIDTH = 'River Width';
var RIVERCHANNEL = 'River Channel';
var HAND = 'Hand';
var ELEVATION = 'Elevation';
var UPG = 'Upstream Drainage Pixel';
var UPA = 'Upstream Drainage Area';
var FLOWDIRECTION = 'Flow Direction';
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
var wth_mask_local = upArea_rd.gt(50);
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

var rwC_local = riverwidthClass.updateMask(wth_mask_local);
var rwC_global = riverwidthClass.updateMask(wth_mask_global);

// Local
var wth_mask_point = viswidth.gt(1);
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

var rwC_point = viswidthClass.updateMask(wth_mask_point);

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
var panel = ui.Panel({style: {width: '250px'}});
var map = ui.Map();
ui.root.add(panel).add(map);
map.style().set('cursor', 'crosshair');

// Create title
panel.add(ui.Label(
  'MERIT Hydro Visualization and Interactive Map',
  {fontWeight: 'bold', fontSize:'20px'}
));

// Create a layer selector that dictates which layer is visible on the map.
var select = ui.Select({
  items: [RIVERCHANNEL, RIVERWIDTH, TERRAIN],
  value: RIVERCHANNEL,
  onChange: redraw,
});
panel.add(ui.Label('Visualization Map:')).add(select);

// Check-boxes to control which layers are shown in the inspector.
panel.add(ui.Label('Band Information:'));
var wthCheck = ui.Checkbox(RIVERWIDTH).setValue(true);
panel.add(wthCheck);
var elevationCheck = ui.Checkbox(ELEVATION).setValue(true);
panel.add(elevationCheck);
var hndCheck = ui.Checkbox(HAND).setValue(true);
panel.add(hndCheck);
var upgCheck = ui.Checkbox(UPG).setValue(true);
panel.add(upgCheck);
var upaCheck = ui.Checkbox(UPA).setValue(true);
panel.add(upaCheck);
var dirCheck = ui.Checkbox(FLOWDIRECTION).setValue(true);
panel.add(dirCheck);

// Create the inspector panel, initially hiding it.
var inspector = ui.Panel({style:{shown: false}});
inspector.style().set({width: '250px', position: 'bottom-right'});
map.add(inspector);

// Register an onClick handler that populates and shows the inspector panel.
map.onClick(function(coords) {
  // Gather the image bands into a single Image that we can asynchronously sample.
  
  var point = ee.Geometry.Point(coords.lon, coords.lat);

var lon = ui.Label();
var lat = ui.Label();

  // Add the dot as the second layer, so it shows up on top of the composite.
  var dot = ui.Map.Layer(point, {color: 'FF0000'}, 'clicked location');
  map.layers().set(1, dot);
  
  var sample = merit.unmask(0).sample(point, 30).first().toDictionary();
  sample.evaluate(function(values) {
    inspector.clear();
    // Display a label that corresponds to a checked checkbox.
    if (wthCheck.getValue()) {
      inspector.add(ui.Label('River Width: ' + values.wth + ' m'));
    }
    if (elevationCheck.getValue()) {
      inspector.add(ui.Label('Elevation: ' + values.elv + ' m'));
    }
    if (upaCheck.getValue()) {
      inspector.add(ui.Label('Upstream Drainage Area: ' + values.upa + ' km^2'));
    }
    if (upgCheck.getValue()) {
      inspector.add(ui.Label('Upstream Drain Pixel: ' + values.upg));
    }
    if (hndCheck.getValue()) {
      inspector.add(ui.Label('Hand: ' + values.hnd + ' m'));
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
// Map Layers
//////////////////////////////////////////////////////////////

// Create a function to render a map layer configured by the user inputs.
function redraw() {
  map.layers().reset();
  var layer = select.getValue();
  var image;

  if (layer == RIVERCHANNEL) {

    map.addLayer(elvBackground, null, 'Background Elevation');
    
    map.addLayer(tributary, {palette: '000000'}, 'Tributaries');
    map.addLayer(viswidth.gt(1).selfMask(), 
      {palette: '071CEC'}, 'River Channel');
    map.addLayer(waterBody,{palette: '5F6EFF'}, 'Non-centerline Water ')


  } else if (layer == RIVERWIDTH) {

    map.addLayer(hillshade,
    {min: 0, max: 600, palette: ['444444', 'e5e5e5']}, 'Hillshade');
    map.addLayer(waterBody, {palette: '000000'}, 'Non-centerline Water');
    
    // Visualize this layer when zooming-in at zoom level above 8  
    map.addLayer(tributary, {palette: '281D2F'}, 'Tributaries', false);

    // Use 'global' at zoom level below 4
    map.addLayer(rwC_point, VIS_WTH, 'River Width (Point Specific)', false);
    map.addLayer(rwC_local, VIS_WTH, 'River Width (Local)', false);
    map.addLayer(rwC_global, VIS_WTH, 'River Width (Global)', true);
  
    
  } else if (layer == TERRAIN){
    
    map.addLayer(waterBody, {palette: '000000'}, 'Non-centerline Water');
    map.addLayer(dem, VIS_DEM, 'Elevation');
    map.addLayer(handClass, VIS_HND, 'Hand', false);
    
  }
}
redraw();