/**
 * Copyright 2022 The Google Earth Engine Community Authors
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

// [START earthengine__apidocs__ee_image_pixelarea]
// Create a pixel area image. Pixel values are square meters based on
// a given CRS and scale (or CRS transform).
var pixelArea = ee.Image.pixelArea();

// The default projection is WGS84 with 1-degree scale.
print('Pixel area default projection', pixelArea.projection());

// When inspecting the output in the Code Editor map, the scale of analysis is
// determined by the zoom level. As you zoom in and out, you'll notice that the
// area of the clicked pixel changes. To set a specific pixel scale when
// performing a computation, provide an argument to the `scale` or
// `crsTransform` parameters whenever a function gives you the option.
Map.addLayer(pixelArea, null, 'Pixel area for inspection', false);

// The "area" band produced by the `pixelArea` function can be useful for
// calculating the area of a certain condition of another image. For example,
// here we use the sum reducer to determine the area above 2250m in the North
// Cascades ecoregion, according to a 30m digital elevation model.

// Import a DEM and subset the "elevation" band.
var elev = ee.Image('NASA/NASADEM_HGT/001').select('elevation');

// Define a high elevation mask where pixels with elevation greater than 2250m
// are set to 1, otherwise 0.
var highElevMask = elev.gt(2250);

// Apply the high elevation mask to the pixel area image.
var highElevArea = pixelArea.updateMask(highElevMask);

// Import an ecoregion feature collection and filter it by ecoregion name.
var ecoregion = ee.FeatureCollection('RESOLVE/ECOREGIONS/2017')
  .filter('ECO_NAME == "North Cascades conifer forests"');

// Display the ecoregion and high elevation area.
Map.setCenter(-121.127, 48.389, 7);
Map.addLayer(ecoregion, null, 'North Cascades ecoregion');
Map.addLayer(highElevArea.clip(ecoregion),
             {palette: 'yellow'}, 'High elevation area');

// Sum the area of high elevation pixels in the North Cascades ecoregion.
var area = highElevArea.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: ecoregion,
  crs: elev.projection(),  // DEM coordinate reference system
  crsTransform: elev.projection().getInfo().transform,  // DEM grid alignment
  maxPixels: 1e8
});

// Fetch the summed area property from the resulting dictionary and convert
// square meters to square kilometers.
var squareMeters = area.getNumber('area');
var squareKilometers = squareMeters.divide(1e6);

print('Square meters above 2250m elevation', squareMeters);
print('Square kilometers above 2250m elevation', squareKilometers);
// [END earthengine__apidocs__ee_image_pixelarea]
