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

// [START earthengine__apidocs__ee_image_expression]
// The following expressions calculate the normalized difference vegetation
// index (NDVI): (NIR - Red) / (NIR + Red).
// NIR is Landsat 8 L2 band 'SR_B5', the 4th band index.
// Red is Landsat 8 L2 band 'SR_B4', the 3rd band index.

// A Landsat 8 L2 surface reflectance image.
var img = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20210508');

// Visualization parameters for NDVI.
var ndviVis = {min: 0, max: 0.5};

// Expression using image band indices.
var bandIndexExp = '(b(4) - b(3)) / (b(4) + b(3))';
var bandIndexImg = img.expression(bandIndexExp).rename('NDVI');
Map.setCenter(-122.14, 37.38, 11);
Map.addLayer(bandIndexImg, ndviVis, 'NDVI 1');

// Expression using image band names.
var bandNameExp = '(b("SR_B5") - b("SR_B4")) / (b("SR_B5") + b("SR_B4"))';
var bandNameImg = img.expression(bandNameExp).rename('NDVI');
Map.addLayer(bandNameImg, ndviVis, 'NDVI 2');

// Expression using named variables.
var namedVarsExp = '(NIR - Red) / (NIR + Red)';
var namedVarsImg = ee.Image().expression({
  expression: namedVarsExp,
  map: {
    NIR: img.select('SR_B5'),
    Red: img.select('SR_B4')
  }
}).rename('NDVI');
Map.addLayer(namedVarsImg, ndviVis, 'NDVI 3');

// Expression using named variables with image band access by dot notation.
var namedVarsDotExp = '(ls8.SR_B5 - ls8.SR_B4) / (ls8.SR_B5 + ls8.SR_B4)';
var namedVarsDotImg = ee.Image().expression({
  expression: namedVarsDotExp,
  map: {ls8: img}
}).rename('NDVI');
Map.addLayer(namedVarsDotImg, ndviVis, 'NDVI 4');

// Expressions can use arithmetic operators (+ - * / % **), relational
// operators (== != < > <= >=), logical operators (&& || ! ^), the ternary
// operator (condition ? ifTrue : ifFalse), and a subset of JavaScript Math
// functions. Math functions are called by name directly, they are not accessed
// from the Math object (e.g., sqrt() instead of Math.sqrt()).
var jsMathExp = 'c = sqrt(pow(a, 2) + pow(b, 2))';
var jsMathImg = ee.Image().expression({
  expression: jsMathExp,
  map: {
    a: ee.Image(5),
    b: img.select('SR_B2')
  }
});
Map.addLayer(jsMathImg, {min: 5000, max: 20000}, 'Hypotenuse', false);
// [END earthengine__apidocs__ee_image_expression]
