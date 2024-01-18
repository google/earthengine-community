/**
 * Copyright 2023 The Google Earth Engine Community Authors
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
 * @fileoverview Earth Engine Developer's Guide examples
 *   from 'Exporting to BigQuery' page
 */

// [START earthengine__bq-export__json]
var states = ee.FeatureCollection('TIGER/2018/States');
var mod11a1 = ee.ImageCollection('MODIS/061/MOD11A1');

// Find the max day and night temperatures per pixel for a given time.
var maxTemp = mod11a1
    .select(['LST_Day_1km', 'LST_Night_1km'])
    .filterDate('2023-05-15', '2023-05-25')
    .max();

// Annotate each state with its max day/night temperatures.
var annotatedStates = states.map(function (e) {
  var dict = maxTemp.reduceRegion({
    reducer: ee.Reducer.max(),
    geometry: e.geometry(),
    scale: 10 * 1000,  // 10 km
  });
  // Convert the dictionary to JSON and add it as a property.
  return e.set('maxTemp', ee.String.encodeJSON(dict));
});

Export.table.toBigQuery(annotatedStates);
// [END earthengine__bq-export__json]

// [START earthengine__bq-export__reduceRegions]
var lucas = ee.FeatureCollection('JRC/LUCAS_HARMO/COPERNICUS_POLYGONS/V1/2018');
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED');

// Fetch the unique date values from the dataset.
var dates = lucas.aggregate_array('survey_date')
    .distinct()
    .map(function (date) {
      return ee.Date.parse('dd/MM/yy', date);
    });

// For each date, annotate the LUCAS samples with the Sentinel-2 band values for
// a two-week window.
function getLucasSamplesForDate(date) {
  date = ee.Date(date);
  var imageForDate = s2
    .filterDate(
      date.advance(-1, 'week'),
      date.advance(1, 'week'))
    .select('B.*');
  var median = imageForDate.median();
  var lucasForDate = lucas.filter(
    ee.Filter.equals('survey_date', date.format('dd/MM/yy')));
  var sample = median.reduceRegions({
    collection: lucasForDate,
    reducer: ee.Reducer.mean(),
    scale: 10,
    tileScale: 8,
  });
  return sample;
}

// Flatten the collection.
var withSamples =
    ee.FeatureCollection(dates.map(getLucasSamplesForDate))
      .flatten();

Export.table.toBigQuery({
  collection: withSamples,
  description: 'lucas_s2_annotated'
});
// [END earthengine__bq-export__reduceRegions]

// [START earthengine__bq-export__transformGeo]
var transformedCollection = originalCollection.map(function transformGeo(e) {
  var myErrorMargin = 10 * 1000;  // meters
  return e.setGeometry(e.geometry(myErrorMargin, 'EPSG:4326', true));
});
// [END earthengine__bq-export__transformGeo]