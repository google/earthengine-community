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

"""Earth Engine Developer's Guide examples from 'Images - Visualization' page."""

import ee
ee.Initialize()

# [START earthengine__images03__viz_image]
# Load an image.
image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318')

# Define the visualization parameters.
image_viz_params = {
    'bands': ['B5', 'B4', 'B3'], 'min': 0, 'max': 0.5, 'gamma': [0.95, 1.1, 1]
}

# Create an RGB image based on the visualization parameters.
image_viz = image.visualize(**image_viz_params)
# [END earthengine__images03__viz_image]

# [START earthengine__images03__palette]
# Load an image.
image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318')

# Create an NDWI image, define visualization parameters, convert to RGB image.
ndwi = image.normalizedDifference(['B3', 'B5'])
ndwi_viz_params = {'min': 0.5, 'max': 1, 'palette': ['00FFFF', '0000FF']}
ndwi_viz = ndwi.visualize(**ndwi_viz_params)
# [END earthengine__images03__palette]

# [START earthengine__images03__mask]
# Mask the non-watery parts of the image, where NDWI < 0.4.
ndwi_viz_masked = ndwi_viz.updateMask(ndwi.gte(0.4))
# [END earthengine__images03__mask]

# [START earthengine__images03__visualize]
# These layers were created previously.
# [END earthengine__images03__visualize]

# [START earthengine__images03__mosaic]
# Mosaic the visualization layers and display (or export).
mosaic = ee.ImageCollection([image_viz, ndwi_viz_masked]).mosaic()
# [END earthengine__images03__mosaic]

# [START earthengine__images03__clip]
# Create a circle by drawing a 20000 meter buffer around a point.
roi = ee.Geometry.Point([-122.4481, 37.7599]).buffer(20000)
mosaic_clipped = mosaic.clip(roi)
# [END earthengine__images03__clip]
