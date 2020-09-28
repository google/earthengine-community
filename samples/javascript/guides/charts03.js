/**
 * Copyright 2020 The Google Earth Engine Community Authors
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
 *     from 'ui.Chart.image.histogram' section
 */

// [START earthengine__charts03__image_histogram]
// Load a Landsat 8 image's reflective bands.
var image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318')
    .select('B[2-5]');

// Define an arbitrary region over San Francisco.
var region = ee.Geometry.Rectangle(-122.45, 37.74, -122.4, 37.8);

// Pre-define some customization options.
var options = {
  title: 'Landsat 8 DN histogram, bands 2-5',
  fontSize: 20,
  hAxis: {title: 'DN'},
  vAxis: {title: 'count of DN'},
  series: {
    0: {color: 'blue'},
    1: {color: 'green'},
    2: {color: 'red'},
    3: {color: 'magenta'}}
};

// Make the histogram, set the options.
var histogram = ui.Chart.image.histogram(image, region, 30)
    .setSeriesNames(['blue', 'green', 'red', 'NIR'])
    .setOptions(options);

// Display the histogram.
print(histogram);
// [END earthengine__charts03__image_histogram]
