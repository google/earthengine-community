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

// [START earthengine__apidocs__ee_image_sample]
// Demonstrate extracting pixels from an image as features with
// ee.Image.sample(), and show how the features are aligned with the pixels.

// An image with one band of elevation data.
var image = ee.Image('CGIAR/SRTM90_V4');
var VIS_MIN = 1620;
var VIS_MAX = 1650;
Map.addLayer(image, {min: VIS_MIN, max: VIS_MAX}, 'SRTM');

// Region to sample.
var region = ee.Geometry.Polygon(
  [[[-110.006, 40.002],
    [-110.006, 39.999],
    [-109.995, 39.999],
    [-109.995, 40.002]]], null, false);
// Show region on the map.
Map.setCenter(-110, 40, 16);
Map.addLayer(ee.FeatureCollection([region]).style({"color": "00FF0022"}));

// Perform sampling; convert image pixels to features.
var samples = image.sample({
  region: region,

  // Default (false) is no geometries in the output.
  // When set to true, each feature has a Point geometry at the center of the
  // image pixel.
  geometries: true,

  // The scale is not specified, so the resolution of the image will be used,
  // and there is a feature for every pixel. If we give a scale parameter, the
  // image will be resampled and there will be more or fewer features.
  //
  // scale: 200,
});

// Visualize sample data using ee.FeatureCollection.style().
var styled = samples
  .map(function (feature) {
    return feature.set('style', {
      pointSize: feature.getNumber('elevation').unitScale(VIS_MIN, VIS_MAX)
          .multiply(15),
    });
  })
  .style({
    color: '000000FF',
    fillColor: '00000000',
    styleProperty: 'style',
    neighborhood: 6,  // increase to correctly draw large points
  });
Map.addLayer(styled);

// Each sample feature has a point geometry and a property named 'elevation'
// corresponding to the band named 'elevation' of the image. If there are
// multiple bands they will become multiple properties. This will print:
//
// geometry: Point (-110.01, 40.00)
// properties:
//   elevation: 1639
print(samples.first());
// [END earthengine__apidocs__ee_image_sample]
