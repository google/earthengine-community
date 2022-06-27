/**
 * Copyright 2021 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_image_clip]
// A digital elevation model.
var dem = ee.Image('NASA/NASADEM_HGT/001');
var demVis = {bands: 'elevation', min: 0, max: 1500};

// Clip the DEM by a polygon geometry.
var geomPoly = ee.Geometry.BBox(-121.55, 39.01, -120.57, 39.38);
var demClip = dem.clip(geomPoly);
print('Clipped image retains metadata and band names', demClip);
Map.setCenter(-121.12, 38.13, 8);
Map.addLayer(demClip, demVis, 'Polygon clip');
Map.addLayer(geomPoly, {color: 'green'}, 'Polygon geometry', false);

// Clip the DEM by a line geometry.
var geomLine = ee.Geometry.LinearRing(
    [[-121.19, 38.10], [-120.53, 38.54], [-120.22, 37.83], [-121.19, 38.10]]);
Map.addLayer(dem.clip(geomLine), demVis, 'Line clip');
Map.addLayer(geomLine, {color: 'orange'}, 'Line geometry', false);

// Images have geometry; clip the dem image by the geometry of an S2 image.
var s2Img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG');
var geomS2Img = s2Img.geometry();
Map.addLayer(dem.clip(geomS2Img), demVis, 'Image geometry clip');
Map.addLayer(geomS2Img, {color: 'blue'}, 'Image geometry', false);

// Don't use ee.Image.clip prior to ee.Image.regionReduction, the "geometry"
// parameter handles it more efficiently.
var zonalMax = dem.select('elevation').reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: geomPoly
});
print('Max elevation (m)', zonalMax.get('elevation'));

// Don't use ee.Image.clip to clip an image by a FeatureCollection, use
// ee.Image.clipToCollection(collection).
var watersheds = ee.FeatureCollection('USGS/WBD/2017/HUC10')
    .filterBounds(ee.Geometry.Point(-122.754, 38.606).buffer(2e4));
Map.addLayer(dem.clipToCollection(watersheds), demVis, 'Watersheds clip');
Map.addLayer(watersheds, {color: 'red'}, 'Watersheds', false);
// [END earthengine__apidocs__ee_image_clip]
