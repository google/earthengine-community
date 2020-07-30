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

"""Earth Engine Developer's Guide examples from 'Images - Edge detectors' page."""

import ee
ee.Initialize()

# [START earthengine__images14__zero_crossings]
# Load a Landsat 8 image, select the panchromatic band.
image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318').select('B8')

# Define a "fat" Gaussian kernel.
fat = ee.Kernel.gaussian(
    radius=3, sigma=3, units='pixels', normalize=True, magnitude=-1)

# Define a "skinny" Gaussian kernel.
skinny = ee.Kernel.gaussian(radius=3, sigma=1, units='pixels', normalize=True)

# Compute a difference-of-Gaussians (DOG) kernel.
dog = fat.add(skinny)

# Compute the zero crossings of the second derivative.
zero_xings = image.convolve(dog).zeroCrossing()
# [END earthengine__images14__zero_crossings]
