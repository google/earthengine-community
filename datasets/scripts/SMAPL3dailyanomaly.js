//SMAPL3dailyanomaly
//Code by Karyn Tabor 
//Last edited 1-04-2023

// This code calculates a normalized anomaly with SMAP L3 AM and PM data
// 1. Calculate the climatology by averaging 31 days of SMAP L3 daily 
//    composite data over every year in the record. The 31-day window is 
//    centered around day t. t is the current day-15.  
// 2. create QA mask 
// 3. Subtract the climatology from the current average to get the anomaly
// 4. Divide the anomaly by the climatology to normalize the data
// 5. Apply QA mask to normalized anomaly before exporting data
// 6. Export masked AM and PM data to drive

//Import county polygons by ISO code
//This example uses Tanzania
var iso_code ='TZA'
var country = ee.FeatureCollection("USDOS/LSIB/2013").filter(ee.Filter.eq('iso_alpha3', iso_code));
var SMAPL3 = ee.ImageCollection("NASA/SMAP/SPL3SMP_E/005_RAW")

//getting today's date minus three days (3 days ago for processing lag)
var anomalydate = ee.Date(Date.now('UTC')).advance(-3,"day").format('YYYY-MM-DD');
var anomalymonth = ee.Number.parse(ee.Date(Date.now('UTC')).advance(-3,"day").format('M'));
var anomalyday = ee.Number.parse(ee.Date(Date.now('UTC')).advance(-3,"day").format('d'));
print(anomalydate, "anomaly date");

//create list of years to calculate climatology
var startyear = 2015; // first year of SMAP data
var currentyear = ee.Number.parse(ee.Date(Date.now('UTC')).advance(-3,"day").format('YYYY'));
var years = ee.List.sequence(2015, currentyear);
//print(years, "list of years");

//select SM for current day
var currentdaySM = SMAPL3.filter(ee.Filter.date(anomalydate));

//set visualization parameters for median image
var soilMoistureVis = {
  min: 0.0,
  max: 0.5,
  palette: ['ff0303','efff07','418504', '0300ff','8006f3'],
};
Map.setCenter(25, -10.00, 4);
//select AM soil moisture

var soilmoisture_AM = currentdaySM.select('soil_moisture_am').toBands();
var soilmoisture_PM = currentdaySM.select('soil_moisture_pm').toBands();
//Visualize Soil Moisture (cm3/cm3)*1000
//Map.addLayer(SM_AM_MEAN, soilMoistureVis, 'Soil Moisture AM');
Map.addLayer(soilmoisture_AM, soilMoistureVis, 'Soil Moisture AM');
Map.addLayer(soilmoisture_PM, soilMoistureVis, 'Soil Moisture PM');

//select QA values
var soilmoisture_AM_qamask = currentdaySM.select('retrieval_qual_flag_am').toBands();
var soilmoisture_PM_qamask = currentdaySM.select('retrieval_qual_flag_pm').toBands();

//invert QA values to create mask
var QA_AM_mask = soilmoisture_AM_qamask.eq(0);  
var QA_PM_mask = soilmoisture_PM_qamask.eq(0); 


// create climatologies
//function calculating image of climatology means for AM
// this isn't working here. returns nothing
 var annualSM_AM = ee.ImageCollection.fromImages(
    years.map(function (year) {
    var date_object = ee.Date.fromYMD(year,anomalymonth, anomalyday);
    var begindate = ee.Date(date_object).advance(-15,"day")
    var enddate = ee.Date(date_object).advance(+15,"day")
    var annual = SMAPL3
        .filter(ee.Filter.date(begindate,enddate))
        .select('soil_moisture_am')
        .mean();
    return annual
        .set('year', year)
        .set('system:time_start', ee.Date.fromYMD(year, 1, 1));
}).flatten()
);
//calculate average of all years
var climSM_AM=annualSM_AM.toBands().reduce(ee.Reducer.mean());
//Map.addLayer(climSM_AM, [], 'Soil Moisture annual AM');

//repeat above function for PM
 var annualSM_PM = ee.ImageCollection.fromImages(
    years.map(function (year) {
    var date_object = ee.Date.fromYMD(year,anomalymonth, anomalyday);
    var begindate = ee.Date(date_object).advance(-15,"day")
    var enddate = ee.Date(date_object).advance(+15,"day")
    var annual = SMAPL3
        .filter(ee.Filter.date(begindate,enddate))
        .select('soil_moisture_pm')
        .mean();
    return annual
}).flatten()
);
//calculate average of all years
var climSM_PM=annualSM_PM.toBands().reduce(ee.Reducer.mean());
//Map.addLayer(climSM_AM, [], 'Soil Moisture annual PM');


//calculate anomaly
var SM_anomaly_AM = soilmoisture_AM.subtract(climSM_AM);
var SM_anomaly_PM = soilmoisture_PM.subtract(climSM_PM);

var SM_anomaly_AM_normalized = SM_anomaly_AM.divide(climSM_AM);
var SM_anomaly_PM_normalized = SM_anomaly_PM.divide(climSM_PM);
//Map.addLayer(SM_anomaly_AM_normalized, [], 'Soil Moisture AM normalized anomaly');
//Map.addLayer(SM_anomaly_PM_normalized, [], 'Soil Moisture PM normalized anomaly');

// Export with maps Mercator projection at 10 km scale.
// after applying QA mask
var SM_anomaly_AM_masked = SM_anomaly_AM_normalized.updateMask(QA_AM_mask);
var SM_anomaly_PM_masked = SM_anomaly_PM_normalized.updateMask(QA_PM_mask);
Map.addLayer(SM_anomaly_AM_masked, [], 'Soil Moisture AM normalized anomaly');
Map.addLayer(SM_anomaly_PM_masked, [], 'Soil Moisture PM normalized anomaly');

//create export task and go to Tasks tab to run
var exportParams = {scale: 10000, region: country, crs: 'EPSG:3857'};
var outputfilenameAM = ['SM_anomaly_AM_normalized_'+ anomalydate.getInfo()];
var outputfilenamePM = ['SM_anomaly_PM_normalized_'+ anomalydate.getInfo()];
Export.image(SM_anomaly_AM_masked, outputfilenameAM, exportParams);
Export.image(SM_anomaly_PM_masked, outputfilenamePM, exportParams);
