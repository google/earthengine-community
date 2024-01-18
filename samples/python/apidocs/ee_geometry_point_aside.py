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

# [START earthengine__apidocs__ee_geometry_point_aside]
def print_result(val, message):
  """A print function to invoke with the aside method."""
  print(val.getInfo())
  print(message)


point = ee.Geometry.Point([-122.08412, 37.42189]).aside(
    print_result, "An ee.Geometry.Point was defined."
)
# [END earthengine__apidocs__ee_geometry_point_aside]
