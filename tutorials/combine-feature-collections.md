```
var UtahGEOMETRY = ee.Geometry.Polygon([
    [-114.05, 37],
    [-109.05, 37],
    [-109.05, 41],
    [-111.05, 41],
    [-111.05, 42],
    [-114.05, 42]
]);

var NewFEATURES = ee.FeatureCollection.randomPoints(UtahGEOMETRY, 25, 12);
var MoreNewFEATURES = ee.FeatureCollection.randomPoints(UtahGEOMETRY, 25, 1);

// Create a new FeatureCollection using a list of the desired FeatureCollections to combine, 
// before flattening them into a single FeatureCollection.
var combinedFeatureCOLLECTION = ee.FeatureCollection([NewFEATURES,MoreNewFEATURES]).flatten();

Map.setCenter(-111.445, 39.251, 6);

Map.addLayer(NewFEATURES, {}, "New Features");
Map.addLayer(MoreNewFEATURES,{color:'red'},"More New Features");
Map.addLayer(combinedFeatureCOLLECTION, {color:'yellow'}, "Combined FeatureCollection");

print(NewFEATURES, MoreNewFEATURES, combinedFeatureCOLLECTION);
```
