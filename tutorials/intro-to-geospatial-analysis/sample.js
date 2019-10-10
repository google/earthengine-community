//  Geometries
Map.setCenter(-88, 41.8, 9);
//  Load Feature Collection of the dissolved boundary of Chicago stored in assets
var chic = ee.FeatureCollection('users/tirthankar25/chicago_diss');
//  Load Feature Collection of the neighborhood-scale Chicago data stored in assets
var chicColl = ee.FeatureCollection('users/tirthankar25/chicago');
//  Add the layer to the map
// Map.addLayer(Res);
Map.addLayer(chic, {color:'red'}, 'Chicago dissolved');
//  Find the rectangle that emcompasses the southernmost, westernmost, easternmost, and northernmost
//  points of the feature
var bound = chic.geometry().bounds();
Map.addLayer(bound, {color:'yellow'},'Bounds');
//  Find the polygon covering the extremities of the feature
var convex = chic.geometry().convexHull();
Map.addLayer(convex, {color:'blue'},'Convex Hull');
//  Find the area common to two or more features
var intersect = bound.intersection(convex,100);
Map.addLayer(intersect, {color:'green'},'Bound and convex intersection');
//  Find the area encompassing two or more features; number is the maximum error in meters
var union = bound.union(convex,100);
Map.addLayer(union, {color:'purple'},'Bound and convex union');
var diff=bound.difference(convex,100);
Map.addLayer(diff, {color:'purple'},'Bound and convex difference');
//  Find area of feature
var ar = chic.geometry().area();
print (ar)
//  Find length of line geometry (You get zero since this is a polygon)
var length = chic.geometry().length();
print (length)
//  Find permeter of feature
var peri = chic.geometry().perimeter();
print (peri)


function performMap(feature) {
 //  Reduce number of vertices in geometry; the number is to specify maximum error in meters
 var simple = feature.simplify(1000);
 //  Find centroid of geometry
 var center = simple.centroid();
 //  Create buffer around geometry; the number represents the width of buffer in meters
 var buff = center.buffer(500);
 //  return variable from function
 return buff;
}
//  Map function over Feature Collection
var mappedCentroid = chicColl.map(performMap);
Map.addLayer(mappedCentroid,{},"Mapped centroids")

//  Features
//  Create Geometry
var varGeometry = ee.Geometry.Polygon(0, 0, 40, 30, 20, 20, 0, 0);
//  Create Feature from Geometry
var varFeature = ee.Feature(varGeometry, {
 Name: ['Feature name', 'Supreme'],
 Size: [500, 1000]
});
//  Get values of a property
var arr=varFeature.get('Size');
print (arr);
//  Select a subset of properties and rename them
var varFeaturenew = varFeature.select(['Name'], ['Descriptor']);
print(varFeaturenew);

//  Images
Map.setCenter(-88, 41.8, 9);
var raw = ee.ImageCollection('MODIS/006/MYD11A2');
var roi = ee.FeatureCollection('users/tirthankar25/chicago');
print(raw);
var bandSel1 = raw.select(0);
var bandSel2=raw.select('LST_Day_1km');
var filtered=raw.filterDate('2002-12-30','2004-4-27');
print(filtered);
var limited = raw.limit(50);
print(limited);
print(bandSel1);
var mean = bandSel1.mean();
var clipped = mean.clip(roi);
var calculate = clipped.multiply(.02).subtract(273.15);
Map.addLayer(calculate,{min: 20, max: 30, palette: ['blue', 'green', 'red']},'LST');
var mask = calculate.gt(30.8);
Map.addLayer(mask,{},"mask");
var masked = clipped.mask(mask);
Map.addLayer(masked,{min: 10, max: 30, palette: ['blue', 'green', 'red']},'LST_masked');
var filtered = raw.filterDate('2002-12-30','2004-4-27');
print(filtered);

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
var geometry = ee.Geometry.Rectangle([55.1, 25, 55.4, 25.4]);
Map.addLayer(geometry);
var allImages = ee.ImageCollection('LANDSAT/LT05/C01/T1_TOA')
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
 collection: allImages,
 //  Name of file
 description: 'dubaiTimelapse',
 //  Quality of video
 dimensions: 720,
 //  FPS of video
 framesPerSecond: 8,
 //  Region of export
 region: geometry
});
