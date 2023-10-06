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

# [START earthengine__apidocs__ee_featurecollection_distance]
# FeatureCollection of power plants in Belgium.
fc = ee.FeatureCollection('WRI/GPPD/power_plants').filter(
    'country_lg == "Belgium"'
)

# Generate an image of distance to nearest power plant.
distance = fc.distance(searchRadius=50000, maxError=50)

# Display the image and FeatureCollection on the map.
m = geemap.Map()
m.set_center(4.56, 50.78, 7)
m.add_ee_layer(distance, {'max': 50000}, 'Distance to power plants')
m.add_ee_layer(fc, {'color': 'red'}, 'Power plants')
m
# [END earthengine__apidocs__ee_featurecollection_distance]
