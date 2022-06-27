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

"""Google Earth Engine Developer's Guide examples for 'Images - Visualization'."""

# [START earthengine__images03__viz_image]
# Load an image.
image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')

# Define the visualization parameters.
image_viz_params = {
    'bands': ['B5', 'B4', 'B3'],
    'min': 0,
    'max': 0.5,
    'gamma': [0.95, 1.1, 1]
}

# Define a map centered on San Francisco Bay.
map_l8 = folium.Map(location=[37.5010, -122.1899], zoom_start=10)

# Add the image layer to the map and display it.
map_l8.add_ee_layer(image, image_viz_params, 'false color composite')
display(map_l8)
# [END earthengine__images03__viz_image]

# [START earthengine__images03__palette]
# Load an image.
image = ee.Image('LANDSAT/LC08/C02/T1_TOA/LC08_044034_20140318')

# Create an NDWI image, define visualization parameters and display.
ndwi = image.normalizedDifference(['B3', 'B5'])
ndwi_viz = {'min': 0.5, 'max': 1, 'palette': ['00FFFF', '0000FF']}

# Define a map centered on San Francisco Bay.
map_ndwi = folium.Map(location=[37.5010, -122.1899], zoom_start=10)

# Add the image layer to the map and display it.
map_ndwi.add_ee_layer(ndwi, ndwi_viz, 'NDWI')
display(map_ndwi)
# [END earthengine__images03__palette]

# [START earthengine__images03__mask]
# Mask the non-watery parts of the image, where NDWI < 0.4.
ndwi_masked = ndwi.updateMask(ndwi.gte(0.4))

# Define a map centered on San Francisco Bay.
map_ndwi_masked = folium.Map(location=[37.5010, -122.1899], zoom_start=10)

# Add the image layer to the map and display it.
map_ndwi_masked.add_ee_layer(ndwi_masked, ndwi_viz, 'NDWI masked')
display(map_ndwi_masked)
# [END earthengine__images03__mask]

# [START earthengine__images03__visualize]
image_rgb = image.visualize(**{'bands': ['B5', 'B4', 'B3'], 'max': 0.5})
ndwi_rgb = ndwi_masked.visualize(**{
    'min': 0.5,
    'max': 1,
    'palette': ['00FFFF', '0000FF']
})
# [END earthengine__images03__visualize]

# [START earthengine__images03__mosaic]
# Mosaic the visualization layers and display (or export).
mosaic = ee.ImageCollection([image_rgb, ndwi_rgb]).mosaic()

# Define a map centered on San Francisco Bay.
map_mosaic = folium.Map(location=[37.5010, -122.1899], zoom_start=10)

# Add the image layer to the map and display it.
map_mosaic.add_ee_layer(mosaic, None, 'mosaic')
display(map_mosaic)
# [END earthengine__images03__mosaic]

# [START earthengine__images03__clip]
# Create a circle by drawing a 20000 meter buffer around a point.
roi = ee.Geometry.Point([-122.4481, 37.7599]).buffer(20000)
mosaic_clipped = mosaic.clip(roi)

# Define a map centered on San Francisco.
map_mosaic_clipped = folium.Map(location=[37.7599, -122.4481], zoom_start=10)

# Add the image layer to the map and display it.
map_mosaic_clipped.add_ee_layer(mosaic_clipped, None, 'mosaic clipped')
display(map_mosaic_clipped)
# [END earthengine__images03__clip]
