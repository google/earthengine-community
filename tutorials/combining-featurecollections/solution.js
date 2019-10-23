var utahGeometry = ee.Geometry.Polygon([
    [-114.05, 37],
    [-109.05, 37],
    [-109.05, 41],
    [-111.05, 41],
    [-111.05, 42],
    [-114.05, 42]
]);

var newFeatures = ee.FeatureCollection.randomPoints(utahGeometry, 25, 12);
var moreNewFeatures = ee.FeatureCollection.randomPoints(utahGeometry, 25, 1);

// Create a new FeatureCollection using a list of the desired FeatureCollections to combine, 
// before flattening them into a single FeatureCollection.
var combinedFeatureCollection = ee.FeatureCollection([newFeatures,moreNewFeatures]).flatten();

Map.setCenter(-111.445, 39.251, 6);

Map.addLayer(newFeatures, {}, "New Features");
Map.addLayer(moreNewFeatures,{color:'red'},"More New Features");
Map.addLayer(combinedFeatureCollection, {color:'yellow'}, "Combined FeatureCollection");

print(newFeatures, moreNewFeatures, combinedFeatureCollection);
