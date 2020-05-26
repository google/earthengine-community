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

"""Earth Engine Developer's Guide examples from 'Images - Texture' page."""

import ee
ee.Initialize()

# [START earthengine__images17__entropy]
# Load a high-resolution NAIP image.
image = ee.Image('USDA/NAIP/DOQQ/m_3712213_sw_10_1_20140613')

# Get the NIR band.
nir = image.select('N')

# Define a neighborhood with a kernel.
square = ee.Kernel.square(radius=4)

# Compute entropy and display.
entropy = nir.entropy(square)
# [END earthengine__images17__entropy]

# [START earthengine__images17__glcm]
# Compute the gray-level co-occurrence matrix (GLCM), get contrast.
glcm = nir.glcmTexture(size=4)
contrast = glcm.select('N_contrast')
# [END earthengine__images17__glcm]

# [START earthengine__images17__gearys]
# Create a list of weights for a 9x9 kernel.
row = [1, 1, 1, 1, 1, 1, 1, 1, 1]
# The center of the kernel is zero.
center_row = [1, 1, 1, 1, 0, 1, 1, 1, 1]
# Assemble a list of lists: the 9x9 kernel weights as a 2-D matrix.
rows = [row, row, row, row, center_row, row, row, row, row]
# Create the kernel from the weights.
# Non-zero weights represent the spatial neighborhood.
kernel = ee.Kernel.fixed(9, 9, rows, -4, -4, False)

# Convert the neighborhood into multiple bands.
neighs = nir.neighborhoodToBands(kernel)

# Compute local Geary's C, a measure of spatial association.
gearys = nir.subtract(neighs).pow(2).reduce(ee.Reducer.sum()).divide(pow(9, 2))
# [END earthengine__images17__gearys]
