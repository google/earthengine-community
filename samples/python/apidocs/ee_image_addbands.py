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

# [START earthengine__apidocs__ee_image_addbands]
# A Sentinel-2 surface reflectance image.
img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG')
print('Original image:', img.getInfo())

# Scale reflectance bands and overwrite the original bands.
refl_bands = img.select('B.*').divide(10000)
img = img.addBands(srcImg=refl_bands, overwrite=True)

# Compute and add a single band (NDVI).
ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI')
img = img.addBands(ndvi)

# Compute and add multiple bands (NDWI and NBR).
ndwi = img.normalizedDifference(['B3', 'B8']).rename('NDWI')
nbr = img.normalizedDifference(['B8', 'B12']).rename('NBR')
new_bands = ee.Image([ndwi, nbr])
img = img.addBands(new_bands)

print('Image with added/modified bands:', img.getInfo())
# [END earthengine__apidocs__ee_image_addbands]
