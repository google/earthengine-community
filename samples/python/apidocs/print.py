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

# [START earthengine__apidocs__print]
"""There is no dedicated print function for the Earth Engine Python API.
To print Earth Engine objects, use Python's built-in `print` function.
Printing an Earth Engine object in Python prints the serialized request for the
object, not the object itself, so you must call `getInfo()` on Earth Engine
objects to get the desired object from the server to the client. For example,
`print(ee.Number(1).getInfo())`. Note that `getInfo()` is a synchronous
operation. Alternatively, the eerepr library provides rich Earth Engine object
representation; it is included in the geemap library.
"""

print(1)  # 1
print(ee.Number(1).getInfo())  # 1
print(ee.Array([1]).getInfo())  # [1]

print(ee.ImageCollection('AAFC/ACI').size().getInfo())  # 10
print(ee.Image('AAFC/ACI/2009').getInfo())  # Image AAFC/ACI/2009 (1 band)

print(
    ee.FeatureCollection("NOAA/NHC/HURDAT2/pacific").size().getInfo()
)  # 28547
# [END earthengine__apidocs__print]
