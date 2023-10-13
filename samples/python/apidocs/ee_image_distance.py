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

# [START earthengine__apidocs__ee_image_distance]
# The objective is to determine the per-pixel distance to a target
# feature (pixel value). In this example, the target feature is water in a
# land cover map.

# Import a Dynamic World land cover image and subset the 'label' band.
lc_img = ee.Image(
    'GOOGLE/DYNAMICWORLD/V1/20210726T171859_20210726T172345_T14TQS'
).select('label')

# Create a binary image where the target feature is value 1, all else 0.
# In the Dynamic World map, water is represented as value 0, so we use the
# ee.Image.eq() relational operator to set it to 1.
target_img = lc_img.eq(0)

# Set a max distance from target pixels to consider in the analysis. Pixels
# with distance greater than this value from target pixels will be masked out.
# Here, we are using units of meters, but the distance kernels also accept
# units of pixels.
max_dist_m = 10000  # 10 km

# Calculate distance to target pixels. Several distance kernels are provided.

# Euclidean distance.
euclidean_kernel = ee.Kernel.euclidean(max_dist_m, 'meters')
euclidean_dist = target_img.distance(euclidean_kernel)
vis = {'min': 0, 'max': max_dist_m}
m = geemap.Map()
m.set_center(-95.68, 46.46, 9)
m.add_layer(euclidean_dist, vis, 'Euclidean distance to target pixels')

# Manhattan distance.
manhattan_kernel = ee.Kernel.manhattan(max_dist_m, 'meters')
manhattan_dist = target_img.distance(manhattan_kernel)
m.add_layer(
    manhattan_dist, vis, 'Manhattan distance to target pixels', False
)

# Chebyshev distance.
chebyshev_kernel = ee.Kernel.chebyshev(max_dist_m, 'meters')
chebyshev_dist = target_img.distance(chebyshev_kernel)
m.add_layer(
    chebyshev_dist, vis, 'Chebyshev distance to target pixels', False
)

# Add the target layer to the map water is blue, all else masked out.
m.add_layer(
    target_img.mask(target_img), {'palette': 'blue'}, 'Target pixels'
)
m
# [END earthengine__apidocs__ee_image_distance]
