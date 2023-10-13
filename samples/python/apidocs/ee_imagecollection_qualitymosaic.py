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

# [START earthengine__apidocs__ee_imagecollection_qualitymosaic]
# The goal is to generate a best-pixel mosaic from a collection of
# Sentinel-2 images where pixel quality is based on a cloud probability score.
# The qualityMosaic() function selects the image (per-pixel) with the HIGHEST
# quality-band-score to contribute to the resulting mosaic. All bands from the
# selected image (per-pixel) associated with the HIGHEST quality-band-score
# are included in the output.

# A Sentinel-2 SR image collection (2 months of images at a specific point).
col = (
    ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(ee.Geometry.Point(-103.19, 40.14))
    .filterDate('2020-07-01', '2020-09-01')
)

# Because cloud probability ranges from 0 to 100 percent (low to high), we need
# to invert the MSK_CLDPRB band values so that low cloud probability pixels
# indicate high quality. Here, an inverting function is mapped over the
# image collection, the inverted MSK_CLDPRB band is added as a "quality" band.
def invertCloudProbabilityBand(img):
  cldProb = img.select('MSK_CLDPRB')
  cldProbInv = cldProb.multiply(-1).rename('quality')
  return img.addBands(cldProbInv)

col = col.map(invertCloudProbabilityBand)

# Image visualization settings.
vis_params = {'bands': ['B4', 'B3', 'B2'], 'min': 0, 'max': 4500}
m = geemap.Map()
m.set_center(-103.19, 40.14, 9)
m.add_layer(col, vis_params, 'Collection (for series inspection)', False)

# Generate a best-pixel mosaic from the image collection.
img = col.qualityMosaic('quality')
m.add_layer(img, vis_params, 'Best-pixel mosaic (by cloud score)')

# To build the worst-pixel mosaic, according to cloud probability, use the
# MSK_CLDPRB band as the quality band (the worst pixels have HIGHEST cloud
# probability score).
img = col.qualityMosaic('MSK_CLDPRB')
m.add_layer(img, vis_params, 'Worst-pixel mosaic (by cloud score)', False)
m
# [END earthengine__apidocs__ee_imagecollection_qualitymosaic]
