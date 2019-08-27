// Set parameters
var country = 'Bolivia'; // selected country (e.g. Bolivia)
var cc = ee.Number(10); // canopy cover percentage
var pixels = ee.Number(6); // minimum forest size in pixels (approximately 0.5 ha in this example)
var lossPixels = ee.Number(6); // minimum mapping area for tree loss

print('Country: ', country);
print('Minimum canopy cover (%):', cc);
print('Minimum forest area (pixel): ', pixels);

// Use Global Forest Change dataset to estimate forest area in year 2000.
var gfc2018 = ee.Image('UMD/hansen/global_forest_change_2018_v1_6');

// Select 'treecover2000' and display all trees in yellow.
var canopyCover = gfc2018.select(['treecover2000']);
Map.addLayer(canopyCover.updateMask(canopyCover), {
    palette: ['yellow'],
    min: 1,
    max: 100
}, 'All trees (yellow)');

// Create and display where canopy cover needs the minimum canopy cover percentage in orange. 
var canopyCover10 = canopyCover.gte(cc);

Map.addLayer(canopyCover10.updateMask(canopyCover10), {
    palette: ['orange'],
    max: 100
}, '>= min canopy cover % (orange)');

// Use connectedPixelCount() to get contiguous area.
var contArea = canopyCover10.mask(canopyCover10).connectedPixelCount();
// Apply the minimum area requirement. 
var minArea = contArea.gte(pixels);

// Display the results in the map (green). The areas less than the minimum area are shown in orange.
Map.addLayer(minArea, {
    min: 0,
    palette: ['orange', 'green']
}, '>= min canopy cover and area size (green)');

// Depending on the level of zoom, you may need to use the nominal scale.
var prj = gfc2018.projection();
var scale = prj.nominalScale();
Map.addLayer(minArea.reproject(prj.atScale(scale)), {
    min: 0,
    palette: ['orange', 'green']
}, '>= min canopy cover and area size (nominal scale)', false);

// Quantify the derived tree area for a country.
// Load country features from Large Scale International Boundary (LSIB) dataset.
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var selected = countries.filter(ee.Filter.eq('country_na', ee.String(country)));
// Center the map to the selected country.
Map.centerObject(selected, 12);
Map.addLayer(selected, '', 'Selected country', false);

var forestArea = minArea.multiply(ee.Image.pixelArea()).divide(10000);
var forestSize = forestArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
print('Year 2000 tree cover (ha) \nmeeting minimum canopy cover and \nforest area thresholds \n ', forestSize.get('treecover2000'));

// If the country is large, you may need to export the result.
var featureCollection = ee.FeatureCollection([ee.Feature(null, forestSize)]);

Export.table.toDrive({
    collection: featureCollection,
    description: 'forest_area_2000' + country,
    fileFormat: 'CSV'
});

// Check the actual minimum area size used for this estimate.
var pixelCount = minArea.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
//print(pixelCount.get('treecover2000'));
var onePixel = ee.Number(forestSize.get('treecover2000')).divide(ee.Number((pixelCount.get('treecover2000'))));
print('Minimum forest area used (ha)\n ', onePixel.multiply(pixels));

// Estimate tree loss.
var treeLoss = gfc2018.select(['lossyear']);
var treeLoss01 = treeLoss.eq(1); // tree loss in year 2001
Map.addLayer(treeLoss01.mask(treeLoss01), {
    palette: ['pink']
}, 'all tree loss 2001 (pink)');

// Select the tree loss within the derived tree cover (>= canopy cover and area requirements).
var treecoverLoss01 = minArea.and(treeLoss01).rename('loss2001');
Map.addLayer(treecoverLoss01.mask(treecoverLoss01), {
    palette: ['brown']
}, 'tree loss inside treecover 2001 (brown)');

// Create connectedPixelCount() to get contiguous area.
var contLoss = treecoverLoss01.mask(treecoverLoss01).connectedPixelCount();
// Apply the minimum area requirement. 
var minLoss = contLoss.gte(lossPixels);

// Display the results in the map. The areas less than the threshold are shown in brown.
Map.addLayer(minLoss, {
    min: 0,
    palette: ['brown', 'red']
}, 'treecover loss >= min area (red)');
Map.addLayer(minLoss.reproject(prj.atScale(scale)), {
    min: 0,
    palette: ['brown', 'red']
}, 'treecover loss >= min area (nominal scale)', false);

var lossArea = minLoss.multiply(ee.Image.pixelArea()).divide(10000);
var lossSize = lossArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
print('Year 2001 tree loss (ha) \nmeeting minimum canopy cover and \nforest area thresholds \n ', lossSize.get('loss2001'));

// If the country is large, you may need to export the result.
var featureCollection = ee.FeatureCollection([ee.Feature(null, lossSize)]);

Export.table.toDrive({
    collection: featureCollection,
    description: 'loss_area_2001_' + country,
    fileFormat: 'CSV'
});

// Estimate the subsequent tree cover (tree cover 2000 minus loss 2001, tree gain can be included if there is data).
// Unmask the derived loss.
var minLossUnmask = minLoss.unmask();
// Switch the binary value of the loss (0, 1) to (1, 0). Please advice which one I should use below.
//var inverse = minLossUnmask.reproject(prj.atScale(scale)).select('loss2001').eq(0); // option 1
var notLoss = minLossUnmask.select('loss2001').eq(0); // option 2
// Combine the derived tree cover and loss (not loss). 
var treecoverLoss01 = minArea.and(notLoss).reproject(prj.atScale(scale));
// Apply the minimum area requirement in order to qualify as a forest.
var contArea01 = treecoverLoss01.mask(treecoverLoss01).connectedPixelCount();
var minArea01 = contArea01.gte(pixels);
Map.addLayer(minArea01.reproject(prj.atScale(scale)), {
    palette: ['ffffff', 'lime']
}, '2001 tree cover (gain not considered) (light green)');

// Quantify the tree cover. 
var forestArea01 = minArea01.multiply(ee.Image.pixelArea()).divide(10000);
var forestSize01 = forestArea01.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
print('Year 2001 tree cover (ha) \nmeeting minimum canopy cover and \nforest area thresholds \n ', forestSize01.get('treecover2000'));
var forestAreaT01 = minArea01.reproject(prj.atScale(scale)).multiply(ee.Image.pixelArea()).divide(10000);
var forestSizeT01 = forestAreaT01.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
print('Year 2001 tree cover (ha) \nmeeting minimum canopy cover and \nforest area thresholds \n ', forestSizeT01.get('treecover2000'));

var featureCollection = ee.FeatureCollection([ee.Feature(null, forestSize01)]);

Export.table.toDrive({
    collection: featureCollection,
    description: 'forest_area_2001_' + country,
    fileFormat: 'CSV'
});
