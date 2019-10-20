// Objectives: We want to pull Land Surface Temperature (LST) day data 
// for 1 year in Uganda.
//
// We want to be able to describe the data using a time series map using a chart.
//
// We want to export a raster to use in public health research.


// Import vector file with country boundaries from Earth Engine
var dataset = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017'); // All countries
var uganda_border = dataset.filter(ee.Filter.eq("country_na","Uganda")); 
// apply filter where "country names" equals "Uganda"
print(uganda_border); 
// print to ensure that new "uganda_border" object just contains polygon for Uganda

  
// Add region outline to layer - for selected countries
Map.addLayer(uganda_border);

var modis = ee.ImageCollection('MODIS/MOD11A2'); // read in image collection
var start = ee.Date('2015-01-01'); // set start date
var dateRange = ee.DateRange(start, start.advance(1, 'year')); 
// set end date 1 year
var mod11a2 = modis.filterDate(dateRange).filterBounds(uganda_border);
// apply filter on date range, uganda boundary

var modLSTday = mod11a2.select('LST_Day_1km'); // pull just 1km day LST

// convert from Kelvin to Celsius
var modLSTc = modLSTday.map(function(img) {
  return img.multiply(0.02).subtract(273.15).copyProperties(img,['system:time_start','system:time_end']); 
}); // this will apply the correction


// Charts Long-term Time Series
var ts1 = ui.Chart.image.series(modLSTc, uganda_border,
 ee.Reducer.mean(), 1000, 'system:time_start').setOptions({
   title: 'LST Long-Term Time Series',
   vAxis: {title: 'LST Celsius'},
 });
 print(ts1);

var clippedLSTc = modLSTc.mean().clip(uganda_border);
// Add clipped image layer to map
Map.addLayer(clippedLSTc, {'min': 0, 'max': 40, 'palette':"blue,limegreen,yellow,darkorange,red"});

// Export image for use in other software:

Export.image.toDrive({
        image: clippedLSTc,
        description: 'LST_Celsius_ug',
        region: uganda_border,
        scale: 1000,
        crs: 'EPSG:4326',
        maxPixels: 1e10
      });
