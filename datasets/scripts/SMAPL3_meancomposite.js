//Code by Karyn Tabor 
//Last edited 12-13-2022

// This code selects the Soil Moisture AM band from L3 SMAP Global soil moisture data 
// 1) masks the data with the retrieval quality flag.
// 2) computes a mean image from multiple images in a series 

//Import county polygons by ISO code
//This example uses Tanzania
var iso_code ='TZA'
var country = ee.FeatureCollection("USDOS/LSIB/2013").filter(ee.Filter.eq('iso_alpha3', iso_code));
var SMAPL4 = ee.ImageCollection("NASA/SMAP/SPL4SMGP/007_RAW")
var SMAPL3 = ee.ImageCollection("NASA/SMAP/SPL3SMP_E/005_RAW")
print(SMAPL3)
//select 1 month of SMAP images to create mean composite
var dataset = SMAPL3.filter(ee.Filter.date('2022-07-01','2022-07-31'));
var soilMoisture = dataset.select('soil_moisture_am');
//set vizualization parameters for mean image
var soilMoistureVis = {
  min: 0.0,
  max: 0.5,
  palette: ['ff0303','efff07','418504', '0300ff','8006f3'],
};
Map.setCenter(25, -10.00, 4);
//select AM soil moisture
var soilmoisture_am = dataset.select('soil_moisture_am').toBands();
var SM_MEAN = soilmoisture_am.reduce(ee.Reducer.mean());
//select QA values
var soilmoisture_am_qamask = dataset.select('retrieval_qual_flag_am').toBands();
//invert QA values to create mask
var QA_mask = soilmoisture_am_qamask.eq(0);  
//add QA mask to soil moisture
var SM_masked = soilmoisture_am.updateMask(QA_mask);
//reduce image stack to single image with mean reducer
var SM_masked_MEAN = SM_masked.reduce(ee.Reducer.mean());
//Visualize Soil Moisture (cm3/cm3)*1000
Map.addLayer(SM_masked_MEAN, soilMoistureVis, 'Soil Mean Moisture Masked');
Map.addLayer(SM_MEAN, soilMoistureVis, 'Soil Mean Moisture');
//select this option to clip map to Tanzania
//Map.addLayer(SM_MEAN.clip(country), soilMoistureVis, 'Soil Moisture Mean');

// Export with maps Mercator projection at 10 km scale.
var exportParams = {scale: 10000, region: country, crs: 'EPSG:3857'};
//create export task and go to Tasks tab to run
Export.image(SM_masked_MEAN, 'SM_MaskedJuly2022MEAN_TZA', exportParams);


// Export with maps Mercator projection at 10 km scale.
var exportParams = {scale: 10000, crs: 'EPSG:3857'};
//create export task and go to Tasks tab to run
Export.image(SM_MEAN, 'SM_July2022MEAN', exportParams);
