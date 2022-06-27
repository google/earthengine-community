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

// [START earthengine__apidocs__ee_featurecollection_copyproperties]
// Import a Landsat 8 surface reflectance image to sample.
var image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_038032_20170722')
                // Select the optical bands.
                .select(['SR_B.']);

// Get the image geometry to define the geographical bounds of the sample.
var imageBounds = image.geometry();

// Sample the image at a set of random points; a feature collection is returned.
var pointSampleFc = image.sample(
    {region: imageBounds, scale: 30, numPixels: 5, geometries: true});

// Copy image properties to the FeatureCollection; three options follow.
print('All non-system image properties copied to the FeatureCollection',
      pointSampleFc.copyProperties(image));

print('Selected image properties copied to the FeatureCollection',
      pointSampleFc.copyProperties({
        source: image,
        properties: ['system:time_start', 'SPACECRAFT_ID']
      }));

print('All but selected image properties copied to the FeatureCollection',
      pointSampleFc.copyProperties({
        source: image,
        exclude: ['TIRS_SSM_MODEL', 'TIRS_SSM_POSITION_STATUS']
      }));
// [END earthengine__apidocs__ee_featurecollection_copyproperties]
