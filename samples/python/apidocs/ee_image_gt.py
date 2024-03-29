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

# [START earthengine__apidocs__ee_image_gt]
# Show world oceans in blue and anything higher than the ellipsoid as gray.
# The bedrock layer is generally close to the geoid (sealevel).
elevation = ee.Image('NOAA/NGDC/ETOPO1').select('bedrock')
water_land = elevation.gt(0.0)
water_land_viz = {'palette': ['cadetblue', 'lightgray']}
m = geemap.Map()
m.add_layer(water_land, water_land_viz, 'water_land')
m
# [END earthengine__apidocs__ee_image_gt]
