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
 *   from 'Mapping (what to do instead of a for-loop)' section
 */

// [START earthengine__gettingStarted07__property_compute]
// This function creates a new property that is the sum of two existing properties.
var addField = function(feature) {
  var sum = ee.Number(feature.get('property1')).add(feature.get('property2'));
  return feature.set({'sum': sum});
};

// Create a FeatureCollection from a list of Features.
var features = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point(-122.4536, 37.7403),
    {property1: 100, property2: 100}),
    ee.Feature(ee.Geometry.Point(-118.2294, 34.039),
    {property1: 200, property2: 300}),
]);

// Map the function over the collection.
var featureCollection = features.map(addField);

// Print a selected property of one Feature.
print(featureCollection.first().get('sum'));

// Print the entire FeatureCollection.
print(featureCollection);
// [END earthengine__gettingStarted07__property_compute]
