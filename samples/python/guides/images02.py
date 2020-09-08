# Copyright 2020 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
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

"""Earth Engine Developer's Guide examples from 'Images - Creating images' page."""

import ee
ee.Initialize()

# [START earthengine__images02__create_image]
from pprint import pprint

print('Create a constant image:')
image_1 = ee.Image(1)
pprint(image_1.getInfo())

print('\nConcatenate two images into one multi-band image:')
image_2 = ee.Image(2)
image_3 = ee.Image.cat([image_1, image_2])
pprint(image_3.getInfo())

print('\nCreate a multi-band image from a list of constants:')
multiband = ee.Image([1, 2, 3])
pprint(multiband.getInfo())

print('\nSelect and (optionally) rename bands:')
renamed = multiband.select(
    ['constant', 'constant_1', 'constant_2'],  # old names
    ['band1', 'band2', 'band3'])               # new names
pprint(renamed.getInfo())

print('\nAdd bands to an image:')
image_4 = image_3.addBands(ee.Image(42))
pprint(image_4.getInfo())
# [END earthengine__images02__create_image]
