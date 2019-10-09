//  Geometries
Map.setCenter(-88, 41.8, 9);
function multi(feature) {
 //  Reduce number of vertices in geometry; the number is to specify maximum error in meters
 var simple = feature.simplify(1000);
 //  Find centroid of geometry
 var center = simple.centroid();
 //  Create buffer around geometry; the number represents the width of buffer in meters
 var buff = center.buffer(500);
 //  return variable from function
 return buff;
}
//  Load Feature Collection of the dissolved boundary of Chicago stored in assets
var Chic = ee.FeatureCollection('users/tirthankar25/chicago_diss');
//  Load Feature Collection of the neighborhood-scale Chicago data stored in assets
//  var Chic_coll=ee.FeatureCollection('users/tirthankar25/chicago');
//  Map function over Feature Collection
//  var Res=Chic_coll.map(multi);
//  Add the layer to the map
// Map.addLayer(Res);
Map.addLayer(Chic, {}, 'Chicago dissolved');
//  Find the rectangle that emcompasses the southernmost, westernmost, easternmost, and northernmost
//  points of the feature
//  var bound = Chic.geometry().bounds();
//  Find the polygon covering the extremities of the feature
//  var convex = Chic.geometry().convexHull();
//  Map.addLayer(bound, {},'Chicago bounds');
//  Map.addLayer(convex, {},'Chicago convex hull');
//  Find the area common to two or more features
//  var Intersect=bound.intersection(convex,100);
//  Map.addLayer(Intersect, {},'Bound and convex intersection');
//  Find the area encompassing two or more features; number is the maximum error in meters
//  var Union=bound.union(convex,100);
//  Map.addLayer(Union, {},'Bound and convex union');
//  Find area of feature
//  var Ar=Chic.geometry().area();
//  Find length of line geometry
//  var length=Chic.geometry().length();
//  Find permeter of feature
//  var peri=Chic.geometry().perimeter();
//  print (peri)

//  Features
//  Create Geometry
var varGeometry = ee.Geometry.Polygon(0, 0, 40, 30, 20, 20, 0, 0);
//  Create Feature from Geometry
var varFeature = ee.Feature(varGeometry, {
 Name: ['Feature name', 'Supreme'],
 Size: [500, 1000]
});
//  Get values of a property
//  var Arr=varFeature.get('Size');
//  print (Arr);
//  Select a subset of properties and rename them
var varFeaturenew = varFeature.select(['Name'], ['Descriptor']);
print(varFeaturenew);
//  Images
Map.setCenter(-88, 41.8, 9);
var Raw = ee.ImageCollection('MODIS/006/MYD11A2');
var ROI = ee.FeatureCollection('users/tirthankar25/chicago');
print(Raw);
var bandsel = Raw.select(0);
//  var bandsel=Raw.select('LST_Day_1km');
//  var filtered=Raw.filterDate('2002-12-30','2004-4-27');
//  print(filtered);
//  var limited=Raw.limit(50);
//  print(limited);
//  print(bandsel);
var mean = bandsel.mean();
Map.addLayer(mean);
//  var clipped=mean.clip(ROI);
//  var calculate=clipped.multiply(.02).subtract(273.15);
//  Map.addLayer(calculate,{min: 30, max: 40, palette: ['blue', 'green', 'red']},'LST');
//  var mask=calculate.gt(30.8);
//  Map.addLayer(mask,{},"mask");
//  var Masked=clipped.mask(mask);
//  Map.addLayer(Masked,{min: 20, max: 30, palette: ['blue', 'green', 'red']},'LST_masked');
//  var filtered=Raw.filterDate('2002-12-30','2004-4-27');
//  print(filtered);
//  Image to table example
var urban = ee.FeatureCollection('users/tirthankar25/chicago');
//  Function to find mean of pixels in region of interest
var regions = function(image) {
 return image.reduceRegions({
  collection: urban,
  reducer: ee.Reducer.mean(),
  scale: 1000,
 });
};
//  Load image
var image = ee.ImageCollection('MODIS/MYD13A1').filterDate('2002-07-08', '2017-07-08')
 .mean().select('NDVI');
print(image);
//  .select("Albedo_BSA_shortwave").multiply(.001);
//  .select('avg_rad');
//  .select('cf_cvg');
//  .select('ET').multiply(.1);
var Final = regions(image);
//  var Final=Final.select(['mean','nbhd_code', 'nbhd'],['Albedo','nbhd_code', 'nbhd']);
//  Export image
Export.table.toDrive({
 collection: Final,
 description: 'NDVI_all',
 fileFormat: 'CSV'
});
//  Timelapse example (based on google API example);
var TheGEOMETRY = ee.Geometry.Rectangle([55.1, 25, 55.4, 25.4]);
Map.addLayer(TheGEOMETRY);
var AllIMAGES = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA')
 //  Filter row and path such that they cover Dubai.
 .filter(ee.Filter.eq('WRS_PATH', 160))
 .filter(ee.Filter.eq('WRS_ROW', 43))
 // Filter cloudy scenes
 .filter(ee.Filter.lt('CLOUD_COVER', 30))
 // Get required years of imagery.
 .filterDate('1984-01-01', '2012-12-30')
 // Select 3-band imagery for the video.
 .select(['B4', 'B3', 'B2'])
 //  Make the data 8 bit
 .map(function(image) {
  return image.multiply(512).uint8();
 });
Export.video.toDrive({
 collection: AllIMAGES,
 //  Name of file
 description: 'Dubai_timelapse',
 //  Quality of video
 dimensions: 720,
 //  FPS of video
 framesPerSecond: 8,
 //  Region of export
 region: TheGEOMETRY
});
