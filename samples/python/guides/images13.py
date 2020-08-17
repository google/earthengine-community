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

# [START earthengine__images13__canny]
# Load a Landsat 8 image, select the panchromatic band.
image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318').select('B8')

# Perform Canny edge detection.
canny = ee.Algorithms.CannyEdgeDetector(image=image, threshold=10, sigma=1)
# [END earthengine__images13__canny]

# [START earthengine__images13__hough]
# Perform Hough transform of the Canny result.
hough = ee.Algorithms.HoughTransform(canny, 256, 600, 100)
# [END earthengine__images13__hough]
