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

// [START earthengine__apidocs__ee_image_rename]
// A Sentinel-2 surface reflectance image.
var img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG')
              .select(['B11', 'B8', 'B3']);
print('Original selected S2 image band names', img.bandNames());

print('Rename bands using a list (JavaScript array or ee.List)',
      img.rename(['SWIR1', 'NIR', 'GREEN']).bandNames());

print('Rename bands using a series of string arguments',
      img.rename('swir1', 'nir', 'green').bandNames());
// [END earthengine__apidocs__ee_image_rename]
