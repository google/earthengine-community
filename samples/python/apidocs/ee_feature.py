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

# [START earthengine__apidocs__ee_feature]
# Create the simplest possible feature.
display(ee.Feature(None))  # Empty feature

# Demonstrate how to set a feature's id.
display(ee.Feature(None, {'id': 'yada'}).id())  # None
display(ee.Feature(None, {'system:index': 'abc123'}).id())  # abc123

# The simplest possible feature with a geometry.
feature = ee.Feature(ee.Geometry.Point([-114.318, 38.985]))
m = geemap.Map()
m.add_layer(feature)
m.center_object(feature, 10)
m
# [END earthengine__apidocs__ee_feature]
