# Copyright 2020 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License")
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Earth Engine Developer's Guide examples from 'Images - Object-based methods' page."""

import ee
ee.Initialize()

# [START earthengine__images18__example_setup]
# Make an area of interest geometry centered on San Francisco.
point = ee.Geometry.Point(-122.1899, 37.5010)
aoi = point.buffer(10000)

# Import a Landsat 8 image, subset the thermal band, and clip to the
# area of interest.
kelvin = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318').select(
    ['B10'], ['kelvin']).clip(aoi)

# Threshold the thermal band to set hot pixels as value 1, mask all else.
hotspots = (kelvin.gt(303).selfMask().rename('hotspots'))
# [END earthengine__images18__example_setup]

# [START earthengine__images18__label_objects]
# Uniquely label the hotspot image objects.
object_id = hotspots.connectedComponents(
    connectedness=ee.Kernel.plus(1), maxSize=128)
# [END earthengine__images18__label_objects]

# [START earthengine__images18__object_size]
# Compute the number of pixels in each object defined by the "labels" band.
object_size = object_id.select('labels').connectedPixelCount(
    maxSize=128, eightConnected=False)
# [END earthengine__images18__object_size]

# [START earthengine__images18__object_area]
# Get a pixel area image.
pixel_area = ee.Image.pixelArea()

# Multiply pixel area by the number of pixels in an object to calculate
# the object area. The result is an image where each pixel
# of an object relates the area of the object in m^2.
object_area = object_size.multiply(pixel_area)
# [END earthengine__images18__object_area]

# [START earthengine__images18__area_mask]
# Threshold the `object_area` image to define a mask that will mask out
# objects below a given size (1 hectare in this case).
area_mask = object_area.gte(10000)

# Update the mask of the `object_id` layer defined previously using the
# minimum area mask just defined.
object_id = object_id.updateMask(area_mask)
# [END earthengine__images18__area_mask]

# [START earthengine__images18__reduce_objects]
# Make a suitable image for `reduceConnectedComponents()` by adding a label
# band to the `kelvin` temperature image.
kelvin = kelvin.addBands(object_id.select('labels'))

# Calculate the mean temperature per object defined by the previously added
# "labels" band.
patch_temp = kelvin.reduceConnectedComponents(
    reducer=ee.Reducer.mean(), labelBand='labels')
# [END earthengine__images18__reduce_objects]
