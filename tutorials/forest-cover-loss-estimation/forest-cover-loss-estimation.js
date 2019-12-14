/**
 * @license
 * Copyright 2019 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Enter a country name and set parameters for forest definition.
// County name must match an entry in Large Scale International Boundary (LSIB) dataset.
var country = 'Bolivia'; // selected country (e.g. Bolivia)
var cc = ee.Number(10); // canopy cover percentage (e.g. 10%)
// minimum forest size in pixels (e.g. 6 pixels, approximately 0.5 ha in this example)
var pixels = ee.Number(6);
// minimum mapping area for tree loss (usually same as the minimum forest area)
var lossPixels = ee.Number(6);
// Load country features from Large Scale International Boundary (LSIB) dataset.
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var selected = countries.filter(ee.Filter.eq('country_na', ee.String(
    country)));
// Center the map to the selected country.
Map.centerObject(selected, 14);

print('Country: ', country);
print('Minimum canopy cover (%):', cc);
print('Minimum forest area (pixel): ', pixels);
print('Minimum mapping unit for tree loss (pixel): ', pixels);

// Use Global Forest Change (GFC) dataset to estimate forest area in year 2000.
var gfc2018 = ee.Image('UMD/hansen/global_forest_change_2018_v1_6');

// Select 'treecover2000'.
var canopyCover = gfc2018.select(['treecover2000']);
Map.addLayer(canopyCover.selfMask(), {
    palette: ['#F3DE8A'],
    min: 1,
    max: 100
}, 'tree cover: all trees 2000 (yellow)', false);

// Extract canopy cover that meets the minimum canopy cover percentage.
var canopyCover10 = canopyCover.gte(cc).selfMask();
Map.addLayer(canopyCover10, {
    palette: ['#EB7F00'],
    max: 100
}, 'tree cover: >= min canopy cover % (orange)', false);

// Use connectedPixelCount() to get contiguous area.
var contArea = canopyCover10.connectedPixelCount();
// Apply the minimum area requirement.
var minArea = contArea.gte(pixels).selfMask();

// Reproject with scale defined as data source's nominal scale to
// ensure pixel resolution used by the above connectedPixelCount()
// call is not determined by the Map's zoom level.
var prj = gfc2018.projection();
var scale = prj.nominalScale();
Map.addLayer(minArea.reproject(prj.atScale(scale)), {
    palette: ['#96ED89']
}, 'tree cover: >= min canopy cover & area (light green)');

// Calculate the derived tree area for the selected country.
// Convert to hectare from square metres by dividing by 10,000.
var forestArea = minArea.multiply(ee.Image.pixelArea()).divide(10000);
var forestSize = forestArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
print('Year 2000 tree cover (ha) \nmeeting minimum canopy cover and \nforest area thresholds \n ',
    forestSize.get('treecover2000'));

// Export the result, in case the country is large.
var featureCollection = ee.FeatureCollection([ee.Feature(null,
    forestSize)]);

Export.table.toDrive({
    collection: featureCollection,
    description: 'forest_area_2000_' + country,
    fileFormat: 'CSV'
});

// Check the actual minimum area size used for this estimate.
// Adjust the number of pixels if necessary.
var pixelCount = minArea.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
var onePixel = forestSize.getNumber('treecover2000')
    .divide(pixelCount
        .getNumber('treecover2000'));
var minAreaUsed = onePixel.multiply(pixels);
print('Minimum forest area used (ha)\n ', minAreaUsed);

// Export the result if not printed.
var featureCollection = ee.FeatureCollection([ee.Feature(null, {
    result: minAreaUsed
})]);

Export.table.toDrive({
    collection: featureCollection,
    description: 'min_area_used_' + country,
    fileFormat: 'CSV'
});

// Estimate tree loss.
var treeLoss = gfc2018.select(['lossyear']);
var treeLoss01 = treeLoss.eq(1).selfMask(); // tree loss in year 2001
Map.addLayer(treeLoss01, {
    palette: ['#000000']
}, 'loss: all tree loss 2001 (black)', false);

// Select the tree loss within the derived tree cover (>= canopy cover and area requirements).
var treecoverLoss01 = minArea.and(treeLoss01).rename('loss2001')
    .selfMask();
Map.addLayer(treecoverLoss01, {
    palette: ['#9768D1']
}, 'loss: inside tree cover (purple)', false);

// Create connectedPixelCount() to get contiguous area.
var contLoss = treecoverLoss01.connectedPixelCount();
// Apply the minimum area requirement.
var minLoss = contLoss.gte(lossPixels).selfMask();

// Display the results in the map.
// The areas less than the threshold are shown in brown.
Map.addLayer(minLoss.reproject(prj.atScale(scale)), {
    min: 0,
    palette: ['FF0000']
}, 'loss: inside tree cover & >= min area (red)');

// Calculate loss area in hectare.
var lossArea = minLoss.multiply(ee.Image.pixelArea()).divide(10000);
var lossSize = lossArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
print('Year 2001 tree loss (ha) \nmeeting minimum canopy cover and \nforest area thresholds \n ',
    lossSize.get('loss2001'));

// If the country is large, you may need to export the result.
var featureCollection = ee.FeatureCollection([ee.Feature(null,
    lossSize)]);

Export.table.toDrive({
    collection: featureCollection,
    description: 'loss_area_2001_' + country,
    fileFormat: 'CSV'
});

// Calculate the subsequent tree cover (tree cover 2000 minus loss 2001)
// Unmask the derived loss.
var minLossUnmask = minLoss.unmask();
// Switch the binary value of the loss (0, 1) to (1, 0).
var notLoss = minLossUnmask.select('loss2001').eq(0);
// Combine the derived tree cover and not-loss with 'and'.
var treecoverLoss01 = minArea.and(notLoss).selfMask();
// Apply the minimum area requirement in order to qualify as a forest.
var contArea01 = treecoverLoss01.connectedPixelCount();
var minArea01 = contArea01.gte(pixels);
Map.addLayer(minArea01.reproject(prj.atScale(scale)), {
    palette: ['#168039']
}, 'tree cover 2001 (gain not considered) (dark green)');

// Calculate the tree cover in hectare.
var forestArea01 = minArea01.multiply(ee.Image.pixelArea()).divide(
    10000);
var forestSize01 = forestArea01.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: selected.geometry(),
    scale: 30,
    maxPixels: 1e13
});
print('Year 2001 tree cover (ha) \nmeeting minimum canopy cover and \nforest area thresholds \n ',
    forestSize01.get('treecover2000'));

var featureCollection = ee.FeatureCollection([ee.Feature(null,
    forestSize01)]);

Export.table.toDrive({
    collection: featureCollection,
    description: 'forest_area_2001_' + country,
    fileFormat: 'CSV'
});

// Display the selected country area.
Map.addLayer(selected.draw({
    color: '#000000',
    strokeWidth: 5
}), {
    opacity: 0.3
}, 'selected country', false);
