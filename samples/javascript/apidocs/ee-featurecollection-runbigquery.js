/**
 * Copyright 2025 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START earthengine__apidocs__ee_featurecollection_runbigquery]
// Get places from Overture Maps Dataset in BigQuery public data.
Map.setCenter(-3.69, 40.41, 12)
var mapGeometry= ee.Geometry(Map.getBounds(true)).toGeoJSONString();
var sql =
    "SELECT geometry, names.primary as name, categories.primary as category "
 + " FROM bigquery-public-data.overture_maps.place "
 + " WHERE ST_INTERSECTS(geometry, ST_GEOGFROMGEOJSON('" + mapGeometry+ "'))";

var features = ee.FeatureCollection.runBigQuery({
  query: sql,
  geometryColumn: 'geometry'
});

// Display all relevant features on the map.
Map.addLayer(features,
             {'color': 'black'},
             'Places from Overture Maps Dataset');


// Create a histogram of the categories and print it.
var propertyOfInterest = 'category';
var histogram = features.filter(ee.Filter.notNull([propertyOfInterest]))
                        .aggregate_histogram(propertyOfInterest);
print(histogram);

// Create a frequency chart for the histogram.
var categories = histogram.keys().map(function(k) {
  return ee.Feature(null, {
    key: k,
    value: histogram.get(k)
  });
});
var sortedCategories = ee.FeatureCollection(categories).sort('value', false);
print(ui.Chart.feature.byFeature(sortedCategories).setChartType('Table'));
// [END earthengine__apidocs__ee_featurecollection_runbigquery]
