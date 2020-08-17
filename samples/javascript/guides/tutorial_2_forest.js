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
 * @fileoverview Earth Engine Developer's Guide examples from
 * Tutorial 2 - Forest
 */

// [START earthengine__tutorial_2_forest__hansen_default]
var gfc2014 = ee.Image('UMD/hansen/global_forest_change_2015');
Map.addLayer(gfc2014);
// [END earthengine__tutorial_2_forest__hansen_default]

// [START earthengine__tutorial_2_forest__tree]
Map.addLayer(gfc2014, {bands: ['treecover2000']}, 'treecover2000');
// [END earthengine__tutorial_2_forest__tree]

// [START earthengine__tutorial_2_forest__false_color]
Map.addLayer(
    gfc2014, {bands: ['last_b50', 'last_b40', 'last_b30']}, 'false color');
// [END earthengine__tutorial_2_forest__false_color]

// [START earthengine__tutorial_2_forest__green]
Map.addLayer(gfc2014, {bands: ['loss', 'treecover2000', 'gain']}, 'green');
// [END earthengine__tutorial_2_forest__green]

// [START earthengine__tutorial_2_forest__loss_gain]
Map.addLayer(gfc2014, {
  bands: ['loss', 'treecover2000', 'gain'],
  max: [1, 255, 1]
}, 'forest cover, loss, gain');
// [END earthengine__tutorial_2_forest__loss_gain]

// [START earthengine__tutorial_2_forest__palettized]
Map.addLayer(gfc2014, {
  bands: ['treecover2000'],
  palette: ['000000', '00FF00']
}, 'forest cover palette');
// [END earthengine__tutorial_2_forest__palettized]

// [START earthengine__tutorial_2_forest__palettized_stretched]
Map.addLayer(gfc2014, {
  bands: ['treecover2000'],
  palette: ['000000', '00FF00'],
  max: 100
}, 'forest cover percent');
// [END earthengine__tutorial_2_forest__palettized_stretched]

// [START earthengine__tutorial_2_forest__stretched_masked]
Map.addLayer(gfc2014.mask(gfc2014), {
  bands: ['treecover2000'],
  palette: ['000000', '00FF00'],
  max: 100
}, 'forest cover masked');
// [END earthengine__tutorial_2_forest__stretched_masked]

// [START earthengine__tutorial_2_forest__layers]
var treeCover = gfc2014.select(['treecover2000']);
var lossImage = gfc2014.select(['loss']);
var gainImage = gfc2014.select(['gain']);

// Add the tree cover layer in green.
Map.addLayer(treeCover.updateMask(treeCover),
    {palette: ['000000', '00FF00'], max: 100}, 'Forest Cover');

// Add the loss layer in red.
Map.addLayer(lossImage.updateMask(lossImage),
            {palette: ['FF0000']}, 'Loss');

// Add the gain layer in blue.
Map.addLayer(gainImage.updateMask(gainImage),
            {palette: ['0000FF']}, 'Gain');
// [END earthengine__tutorial_2_forest__layers]

// [START earthengine__tutorial_2_forest__and]
// Load the data and select the bands of interest.
var gfc2014 = ee.Image('UMD/hansen/global_forest_change_2015');
var lossImage = gfc2014.select(['loss']);
var gainImage = gfc2014.select(['gain']);

// Use the and() method to create the lossAndGain image.
var gainAndLoss = gainImage.and(lossImage);

// Show the loss and gain image.
Map.addLayer(gainAndLoss.updateMask(gainAndLoss),
    {palette: 'FF00FF'}, 'Gain and Loss');
// [END earthengine__tutorial_2_forest__and]

// [START earthengine__tutorial_2_forest__complete_example]
// Displaying forest, loss, gain, and pixels where both loss and gain occur.
var gfc2014 = ee.Image('UMD/hansen/global_forest_change_2015');
var lossImage = gfc2014.select(['loss']);
var gainImage = gfc2014.select(['gain']);
var treeCover = gfc2014.select(['treecover2000']);

// Use the and() method to create the lossAndGain image.
var gainAndLoss = gainImage.and(lossImage);

// Add the tree cover layer in green.
Map.addLayer(treeCover.updateMask(treeCover),
    {palette: ['000000', '00FF00'], max: 100}, 'Forest Cover');

// Add the loss layer in red.
Map.addLayer(lossImage.updateMask(lossImage),
    {palette: ['FF0000']}, 'Loss');

// Add the gain layer in blue.
Map.addLayer(gainImage.updateMask(gainImage),
    {palette: ['0000FF']}, 'Gain');

// Show the loss and gain image.
Map.addLayer(gainAndLoss.updateMask(gainAndLoss),
    {palette: 'FF00FF'}, 'Gain and Loss');
// [END earthengine__tutorial_2_forest__complete_example]

// [START earthengine__tutorial_2_forest__sum_pixels]
// Load country features from Large Scale International Boundary (LSIB) dataset.
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Subset the Congo Republic feature from countries.
var congo = countries.filter(ee.Filter.eq('country_na', 'Rep of the Congo'));

// Get the forest loss image.
var gfc2014 = ee.Image('UMD/hansen/global_forest_change_2015');
var lossImage = gfc2014.select(['loss']);

// Sum the values of forest loss pixels in the Congo Republic.
var stats = lossImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: congo,
  scale: 30
});
print(stats);
// [END earthengine__tutorial_2_forest__sum_pixels]

// [START earthengine__tutorial_2_forest__sum_pixels_fixed]
// Load country features from Large Scale International Boundary (LSIB) dataset.
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Subset the Congo Republic feature from countries.
var congo = countries.filter(ee.Filter.eq('country_na', 'Rep of the Congo'));

// Get the forest loss image.
var gfc2014 = ee.Image('UMD/hansen/global_forest_change_2015');
var lossImage = gfc2014.select(['loss']);

// Sum the values of forest loss pixels in the Congo Republic.
var stats = lossImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: congo,
  scale: 30,
  maxPixels: 1e9
});
print(stats);
// [END earthengine__tutorial_2_forest__sum_pixels_fixed]

// [START earthengine__tutorial_2_forest__nicer_print]
print('pixels representing loss: ', stats.get('loss'));
// [END earthengine__tutorial_2_forest__nicer_print]

// [START earthengine__tutorial_2_forest__area_lost]
// Load country features from Large Scale International Boundary (LSIB) dataset.
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Subset the Congo Republic feature from countries.
var congo = countries.filter(ee.Filter.eq('country_na', 'Rep of the Congo'));

// Get the forest loss image.
var gfc2014 = ee.Image('UMD/hansen/global_forest_change_2015');
var lossImage = gfc2014.select(['loss']);
var areaImage = lossImage.multiply(ee.Image.pixelArea());

// Sum the values of forest loss pixels in the Congo Republic.
var stats = areaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: congo,
  scale: 30,
  maxPixels: 1e9
});
print('pixels representing loss: ', stats.get('loss'), 'square meters');
// [END earthengine__tutorial_2_forest__area_lost]

// [START earthengine__tutorial_2_forest__area_lost_concessions]
// Load country features from Large Scale International Boundary (LSIB) dataset.
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Subset the Congo Republic feature from countries.
var congo = ee.Feature(
  countries
    .filter(ee.Filter.eq('country_na', 'Rep of the Congo'))
    .first()
);

// Subset protected areas to the bounds of the congo feature
// and other criteria. Clip to the intersection with congo.
var protectedAreas = ee.FeatureCollection('WCMC/WDPA/current/polygons')
  .filter(ee.Filter.and(
    ee.Filter.bounds(congo.geometry()),
    ee.Filter.neq('IUCN_CAT', 'VI'),
    ee.Filter.neq('STATUS', 'proposed'),
    ee.Filter.lt('STATUS_YR', 2010)
  ))
  .map(function(feat){
    return congo.intersection(feat);
  });

// Get the loss image.
var gfc2014 = ee.Image('UMD/hansen/global_forest_change_2015');
var lossIn2012 = gfc2014.select(['lossyear']).eq(12);
var areaImage = lossIn2012.multiply(ee.Image.pixelArea());

// Calculate the area of loss pixels in the Congo Republic.
var stats = areaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: congo.geometry(),
  scale: 30,
  maxPixels: 1e9
});
print(
  'Area lost in the Congo Republic:',
  stats.get('lossyear'),
  'square meters'
);

// Calculate the area of loss pixels in the protected areas.
var stats = areaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: protectedAreas.geometry(),
  scale: 30,
  maxPixels: 1e9
});
print(
  'Area lost in protected areas:',
  stats.get('lossyear'),
  'square meters'
);
// [END earthengine__tutorial_2_forest__area_lost_concessions]

// [START earthengine__tutorial_2_forest__yearly_loss_grouped]
// Load country boundaries from LSIB.
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
// Get a feature collection with just the Congo feature.
var congo = countries.filter(ee.Filter.eq('country_co', 'CF'));

// Get the loss image.
// This dataset is updated yearly, so we get the latest version.
var gfc2017 = ee.Image('UMD/hansen/global_forest_change_2017_v1_5');
var lossImage = gfc2017.select(['loss']);
var lossAreaImage = lossImage.multiply(ee.Image.pixelArea());

var lossYear = gfc2017.select(['lossyear']);
var lossByYear = lossAreaImage.addBands(lossYear).reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1
    }),
  geometry: congo,
  scale: 30,
  maxPixels: 1e9
});
print(lossByYear);
// [END earthengine__tutorial_2_forest__yearly_loss_grouped]

// [START earthengine__tutorial_2_forest__yearly_loss_format]
var statsFormatted = ee.List(lossByYear.get('groups'))
  .map(function(el) {
    var d = ee.Dictionary(el);
    return [ee.Number(d.get('group')).format("20%02d"), d.get('sum')];
  });
var statsDictionary = ee.Dictionary(statsFormatted.flatten());
print(statsDictionary);
// [END earthengine__tutorial_2_forest__yearly_loss_format]

// [START earthengine__tutorial_2_forest__yearly_loss_chart]
var chart = ui.Chart.array.values({
  array: statsDictionary.values(),
  axis: 0,
  xLabels: statsDictionary.keys()
}).setChartType('ColumnChart')
  .setOptions({
    title: 'Yearly Forest Loss',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Area (square meters)'},
    legend: { position: "none" },
    lineWidth: 1,
    pointSize: 3
  });
print(chart);
// [END earthengine__tutorial_2_forest__yearly_loss_chart]

// [START earthengine__tutorial_2_forest__forma_vis]
// Convert dates from milliseconds to seconds.
var start = ee.Date('2012-01-01').millis().divide(1000);
var end = ee.Date('2013-01-01').millis().divide(1000);

// Load the FORMA 500 dataset.
var forma = ee.Image('FORMA/FORMA_500m');

// Create a binary layer from the dates of interest.
var forma2012 = forma.gte(start).and(forma.lte(end));

Map.setCenter(15.87, -0.391, 7);
Map.addLayer(
  forma2012.mask(forma2012),
  {palette: ['FF0000']},
  'FORMA alerts in 2012'
);
// [END earthengine__tutorial_2_forest__forma_vis]

// [START earthengine__tutorial_2_forest__forma_counting]
// Load country features from Large Scale International Boundary (LSIB) dataset.
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Subset the Congo Republic feature from countries.
var congo = ee.Feature(
  countries
    .filter(ee.Filter.eq('country_na', 'Rep of the Congo'))
    .first()
);

// Subset protected areas to the bounds of the congo feature
// and other criteria. Clip to the intersection with congo.
var protectedAreas = ee.FeatureCollection('WCMC/WDPA/current/polygons')
  .filter(ee.Filter.and(
    ee.Filter.bounds(congo.geometry()),
    ee.Filter.neq('IUCN_CAT', 'VI'),
    ee.Filter.neq('STATUS', 'proposed'),
    ee.Filter.lt('STATUS_YR', 2010)
  ))
  .map(function(feat){
    return congo.intersection(feat);
  });

// Display protected areas on the map.
Map.addLayer(
  protectedAreas,
  {color: '000000'},
  'Congo Republic protected areas'
);

// Calculate the number of FORMA pixels in protected
// areas of the Congo Republic, 2012.
var stats = forma2012.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: protectedAreas.geometry(),
  scale: 500
});
print('Number of FORMA pixels, 2012: ', stats.get('constant'));
// [END earthengine__tutorial_2_forest__forma_counting]

// [START earthengine__tutorial_2_forest__forma_regions]
var regionsStats = forma2012.reduceRegions({
  collection: protectedAreas,
  reducer: ee.Reducer.sum(),
  scale: forma2012.projection().nominalScale()
});
print(regionsStats);
// [END earthengine__tutorial_2_forest__forma_regions]

// [START earthengine__tutorial_2_forest__comparing]
// Convert dates from milliseconds to seconds.
var start = ee.Date('2012-01-01').millis().divide(1000);
var end = ee.Date('2013-01-01').millis().divide(1000);
var region = ee.Geometry.Rectangle([-59.81163, -9.43348, -59.27561, -9.22818]);

// Load the FORMA 500 dataset.
var forma = ee.Image('FORMA/FORMA_500m');

// Create a binary layer from the dates of interest.
var forma2012 = forma.gte(start).and(forma.lte(end));

// Load Hansen et al. data and get change in 2012.
var gfc = ee.Image('UMD/hansen/global_forest_change_2015');
var gfc12 = gfc.select(['lossyear']).eq(12);

// Create an image which is one where the datasets
// both show deforestation and zero elsewhere.
var gfc_forma = gfc12.eq(1).and(forma2012.eq(1));

// Display data on the map.
Map.setCenter(-59.58813, -9.36439, 11);
Map.addLayer(forma.updateMask(forma), {palette: '00FF00'}, 'Forma (green)');
Map.addLayer(gfc12.updateMask(gfc12), {palette: 'FF0000'}, 'Hansen (red)');
Map.addLayer(
  gfc_forma.updateMask(gfc_forma),
  {palette: 'FFFF00'},
  'Hansen & FORMA (yellow)'
);
// [END earthengine__tutorial_2_forest__comparing]
