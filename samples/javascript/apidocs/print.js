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

// [START earthengine__apidocs__print]
print(1);  // 1
print(ee.Number(1));  // 1
print(ee.Array([1]));  // [1]

print(ee.ImageCollection('AAFC/ACI').size());  // 10
print(ee.Image('AAFC/ACI/2009'));  // Image AAFC/ACI/2009 (1 band)

print(ee.FeatureCollection("NOAA/NHC/HURDAT2/pacific").size());  // 28547
// [END earthengine__apidocs__print]
