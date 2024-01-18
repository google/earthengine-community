# Copyright 2023 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START earthengine__apidocs__ee_imagecollection]
print('Image collection from a string:',
      ee.ImageCollection('COPERNICUS/S2_SR').limit(3).getInfo())

img1 = ee.Image('COPERNICUS/S2_SR/20170328T083601_20170328T084228_T35RNK')
img2 = ee.Image('COPERNICUS/S2_SR/20170328T083601_20170328T084228_T35RNL')
img3 = ee.Image('COPERNICUS/S2_SR/20170328T083601_20170328T084228_T35RNM')
print('Image collection from a list of images:',
      ee.ImageCollection([img1, img2, img3]).getInfo())

print('Image collection from a single image:',
      ee.ImageCollection(img1).getInfo())
# [END earthengine__apidocs__ee_imagecollection]
