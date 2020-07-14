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

"""Earth Engine Developer's Guide examples from 'Images - Convolutions' page."""

import ee
ee.Initialize()

# [START earthengine__images10__smoothing]
# Load and display an image.
image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318')

# Define a boxcar or low-pass kernel.
boxcar = ee.Kernel.square(radius=7, units='pixels', normalize=True)

# Smooth the image by convolving with the boxcar kernel.
smooth = image.convolve(boxcar)
# [END earthengine__images10__smoothing]

# [START earthengine__images10__edges]
# Define a Laplacian, or edge-detection kernel.
laplacian = ee.Kernel.laplacian8(normalize=False)

# Apply the edge-detection kernel.
edgy = image.convolve(laplacian)
# [END earthengine__images10__edges]

# [START earthengine__images10__fixed]
# Create a list of weights for a 9x9 kernel.
row = [1, 1, 1, 1, 1, 1, 1, 1, 1]
# The center of the kernel is zero.
center_row = [1, 1, 1, 1, 0, 1, 1, 1, 1]
# Assemble a list of lists: the 9x9 kernel weights as a 2-D matrix.
rows = [row, row, row, row, center_row, row, row, row, row]
# Create the kernel from the weights.
kernel = ee.Kernel.fixed(9, 9, rows, -4, -4, False)
print(kernel)
# [END earthengine__images10__fixed]
