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

# [START earthengine__apidocs__ee_image_remap]
# A land cover image.
img = ee.Image('ESA/WorldCover/v100/2020')

# A list of pixel values to replace.
from_list = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100]

# A corresponding list of replacement values (10 becomes 1, 20 becomes 2, etc).
to_list = [1, 2, 2, 2, 3, 2, 4, 5, 6, 6, 2]

# Replace pixel values in the image. If the image is multi-band, only the
# remapped band will be returned. The returned band name is "remapped".
# Input image properties are retained in the output image.
img_remap = img.remap(from_list, to_list, defaultValue=0, bandName='Map')

# Display the original and remapped images. Note that similar land cover
# classes in the original image are grouped into aggregate classes by
# from → to value mapping.
m = geemap.Map()
m.add_layer(img, None, 'Original image')
m.add_layer(
    img_remap,
    {
        'min': 1,
        'max': 6,
        'palette': [
            'darkgreen',
            'lightgreen',
            'red',
            'white',
            'blue',
            'lightblue',
        ],
    },
    'Remapped image',
)
m
# [END earthengine__apidocs__ee_image_remap]
