/**
 * Copyright 2022 The Google Earth Engine Community Authors
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
 * @fileoverview For the /earth-engine/cloud/api_monitoring page.  Based on the
 * Code Editor example:  Examples > Cloud Masking > Landsat8 Surface Reflectance
 */

// [START earthengine__cloud_api_monitoring__workload_tags]
// Cloud masking function.
function maskL8sr(image) {
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);

  // Apply the scaling factors to the appropriate bands.
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);

  // Replace the original bands with the scaled ones and apply the masks.
  return image.addBands(opticalBands, null, true)
      .addBands(thermalBands, null, true)
      .updateMask(qaMask)
      .updateMask(saturationMask);
}

// Set a default workload tag.
ee.data.setDefaultWorkloadTag('landsat-compositing')
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
                     .filterDate('2020-01-01', '2021-01-01')
                     .map(maskL8sr);
var composite = collection.select('SR_B.').median();
print(composite);

// Set a new workload tag.
ee.data.setWorkloadTag('export-jobs');
Export.image.toAsset(composite);
ee.data.resetWorkloadTag(); // Reset to landsat-compositing

ee.data.resetWorkloadTag(true); // Reset back to empty
// [END earthengine__cloud_api_monitoring__workload_tags]
