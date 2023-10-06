# Copyright 2021 The Google Earth Engine Community Authors
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

"""Google Earth Engine Developer's Guide examples for 'Images - Registering Images'."""

# [START earthengine__register__displacement]
# Load the two images to be registered.
image1 = ee.Image(
    'SKYSAT/GEN-A/PUBLIC/ORTHO/MULTISPECTRAL/s01_20150502T082736Z'
)
image2 = ee.Image(
    'SKYSAT/GEN-A/PUBLIC/ORTHO/MULTISPECTRAL/s01_20150305T081019Z'
)

# Use bicubic resampling during registration.
image1_orig = image1.resample('bicubic')
image2_orig = image2.resample('bicubic')

# Choose to register using only the 'R' band.
image1_red_band = image1_orig.select('R')
image2_red_band = image2_orig.select('R')

# Determine the displacement by matching only the 'R' bands.
displacement = image2_red_band.displacement(
    referenceImage=image1_red_band, maxOffset=50.0, patchWidth=100.0
)

# Compute image offset and direction.
offset = displacement.select('dx').hypot(displacement.select('dy'))
angle = displacement.select('dx').atan2(displacement.select('dy'))

# Display offset distance and angle.
import math

# Define a map centered on Central Kenya.
map_registration = geemap.Map(center=[0.58, 37.46], zoom=15)

# Add the image layers to the map.
map_registration.add_ee_layer(offset, {'min': 0, 'max': 20}, 'offset')
map_registration.add_ee_layer(angle, {'min': -math.pi, 'max': math.pi}, 'angle')
# [END earthengine__register__displacement]

# [START earthengine__register__displace]
# Use the computed displacement to register all original bands.
registered = image2_orig.displace(displacement)

# Define visualization parameters.
vis_params = {'bands': ['R', 'G', 'B'], 'max': 4000}

# Add the image layers to the map.
map_registration.add_ee_layer(image1_orig, vis_params, 'Reference')
map_registration.add_ee_layer(image2_orig, vis_params, 'Before Registration')
map_registration.add_ee_layer(registered, vis_params, 'After Registration')
# [END earthengine__register__displace]

# [START earthengine__register__register]
also_registered = image2_orig.register(
    referenceImage=image1_orig, maxOffset=50.0, patchWidth=100.0
)

# Add the image layer to the map and display it.
map_registration.add_ee_layer(also_registered, vis_params, 'Also Registered')
display(map_registration)
# [END earthengine__register__register]
