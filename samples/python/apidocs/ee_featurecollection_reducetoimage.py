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

# [START earthengine__apidocs__ee_featurecollection_reducetoimage]
# FeatureCollection of power plants in Belgium.
fc = ee.FeatureCollection('WRI/GPPD/power_plants').filter(
    'country_lg == "Belgium"'
)

# Create an image from features pixel values are determined from reduction of
# property values of the features intersecting each pixel.
image = fc.reduceToImage(properties=['gwh_estimt'], reducer=ee.Reducer.sum())

# The goal is to sum the electricity generated in 2015 for the power plants
# intersecting 10 km cells and view the result as a map layer.
# ee.FeatureCollection.reduceToImage does not allow the image projection to be
# set because it is waiting on downstream functions that include "crs",
# "scale", and "crsTransform" parameters to define it (e.g., Export.image.*).
# Here, we'll force the projection with ee.Image.reproject so the result can be
# viewed in the map. Note that using small scales with reproject while viewing
# large regions breaks the features that make Earth Engine fast and may result
# in poor performance and/or errors.
image = image.reproject('EPSG:3035', None, 10000)

# Display the image on the map.
m = geemap.Map()
m.set_center(4.3376, 50.947, 8)
m.add_layer(
    image.updateMask(image.gt(0)),
    {'min': 0, 'max': 2000, 'palette': ['yellow', 'orange', 'red']},
    'Total estimated annual electricity generation, 2015',
)
m.add_layer(fc, None, 'Belgian power plants')
m
# [END earthengine__apidocs__ee_featurecollection_reducetoimage]
