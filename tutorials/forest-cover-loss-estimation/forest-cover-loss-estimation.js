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

// Create and display where canopy cover is 10% or more in orange. 
var canopyCover10 = canopyCover.gte(cc);

Map.addLayer(canopyCover10.updateMask(canopyCover10), {
    palette: ['orange'],
    max: 100
}, '>= min canopy cover % (orange)');

// Create connectedPixelCount() to get contiguous area.
var contArea = canopyCover10.mask(canopyCover10).connectedPixelCount();
// Apply the threshold (6 pixels). 
var minArea = contArea.gte(pixels);

// Display the results in the map. The areas less than the threshold are shown in orange.
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

// Quantify this forest area for a country.
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
    description: 'forest_area_' + country,
    fileFormat: 'CSV'
});

// Check the actual minimum area size used for this estimate
var pixelCount = minArea.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
//print(pixelCount.get('treecover2000'));
var onePixel = ee.Number(forestSize.get('treecover2000')).divide(ee.Number((pixelCount.get('treecover2000'))));
print('Minimum forest area used (ha)\n ', onePixel.multiply(pixels));

// Estimate tree loss
var treeLoss = gfc2018.select(['lossyear']);
var treeLoss01 = treeLoss.eq(1); // tree loss in year 2001
Map.addLayer(treeLoss01.mask(treeLoss01), {
    palette: ['pink']
}, 'all tree loss 2001 (pink)');

// Select loss only in tree cover >= canopy cover and area requirements
var treecoverLoss01 = minArea.and(treeLoss01).rename('loss2001');
Map.addLayer(treecoverLoss01.mask(treecoverLoss01), {
    palette: ['brown']
}, 'tree loss inside treecover 2001 (brown)');

// Create connectedPixelCount() to get contiguous area.
var contLoss = treecoverLoss01.mask(treecoverLoss01).connectedPixelCount();
// Apply the threshold (6 pixels). 
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
    description: 'loss_area_' + country,
    fileFormat: 'CSV'
});
